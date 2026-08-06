import { useCallback, useEffect, useRef, useState } from "react";

interface UseVoiceRecorderOptions {
    onRecordingFinished?: (blob: Blob) => void | Promise<void>;
}

export function useVoiceRecorder({
    onRecordingFinished,
}: UseVoiceRecorderOptions = {}) {
    const [isRecording, setIsRecording] = useState(false);
    const isRecordingAbortedRef = useRef(false);

    const [waveform, setWaveform] = useState<number[]>([]);
    const MAX_POINTS = 100;           // меньше столбиков — спокойнее
    const UPDATE_INTERVAL = 150;      // мс между обновлениями UI
    const SMOOTHING = 0.9;          // чем выше — тем плавнее

    const lastUpdateRef = useRef(0);
    const lastValueRef = useRef(0);

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const chunksRef = useRef<Blob[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    const stopAnimation = () => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };

    const cleanup = async () => {
        stopAnimation();

        streamRef.current?.getTracks().forEach((track) => track.stop());

        if (audioContextRef.current) {
            await audioContextRef.current.close();
        }

        streamRef.current = null;
        recorderRef.current = null;
        analyserRef.current = null;
        audioContextRef.current = null;

        setWaveform([]);
    };

    const updateVolume = useCallback(() => {
        const analyser = analyserRef.current;
        if (!analyser) return;

        const buffer = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buffer);

        let sum = 0;
        for (const value of buffer) {
            const normalized = (value - 128) / 128;
            sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / buffer.length);

        // усиление тихих звуков
        let level = Math.min(rms * 1.2, 1);
        level = Math.pow(level, 0.8);

        // сглаживание
        const smoothed = lastValueRef.current * SMOOTHING + level * (1 - SMOOTHING);
        lastValueRef.current = smoothed;

        const now = performance.now();

        if (now - lastUpdateRef.current >= UPDATE_INTERVAL) {
            lastUpdateRef.current = now;

            setWaveform((prev) => {
                const next = [...prev, smoothed];
                return next.slice(-MAX_POINTS);
            });
        }

        animationFrameRef.current = requestAnimationFrame(updateVolume);
    }, []);

    const startRecording = useCallback(async () => {
        if (isRecording) return;

        isRecordingAbortedRef.current = false;

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        const audioContext = new AudioContext();

        const source =
            audioContext.createMediaStreamSource(stream);

        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 1024;

        source.connect(analyser);

        const recorder = new MediaRecorder(stream);

        chunksRef.current = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        recorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, {
                type: recorder.mimeType,
            });

            if (!isRecordingAbortedRef.current) {
                await onRecordingFinished?.(blob);
            }

            isRecordingAbortedRef.current = false;

            await cleanup();

            setIsRecording(false);
        };

        streamRef.current = stream;
        recorderRef.current = recorder;
        analyserRef.current = analyser;
        audioContextRef.current = audioContext;

        recorder.start();

        setIsRecording(true);

        updateVolume();
    }, [isRecording, onRecordingFinished, updateVolume]);

    const stopRecording = useCallback((aborted: boolean) => {
        isRecordingAbortedRef.current = aborted;
        recorderRef.current?.stop();
    }, []);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    return {
        isRecording,
        waveform,
        startRecording,
        stopRecording,
    };
}