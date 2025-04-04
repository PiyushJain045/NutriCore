
import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { analyzePoseForExercise } from '@/utils/poseAnalyzer';
import { useSound } from '@/hooks/useSound';

interface PoseDetectionProps {
  poseName: string;
  onClose: () => void;
}

const PoseDetection: React.FC<PoseDetectionProps> = ({ poseName, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<posenet.PoseNet | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [feedback, setFeedback] = useState('Setting up camera...');
  const [poseCorrect, setPoseCorrect] = useState(false);
  const requestAnimationRef = useRef<number | null>(null);
  
  // Exercise tracking states
  const [repCount, setRepCount] = useState(0);
  const [maxDepth, setMaxDepth] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'up' | 'down' | 'waiting'>('waiting');
  const lastPositionRef = useRef<number>(0);
  const repInProgressRef = useRef<boolean>(false);
  
  // Voice feedback
  const { playSound } = useSound();
  const lastFeedbackTimeRef = useRef<number>(Date.now());
  const feedbackCooldown = 3000; // 3 seconds between vocal feedback

  // Load the model when component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Initialize TensorFlow.js before loading the model
        await tf.ready();
        console.log("TensorFlow.js initialized successfully");
        
        // Set the backend to webgl (more reliable than the default)
        await tf.setBackend('webgl');
        console.log("Backend set to:", tf.getBackend());
        
        // Load the model
        const loadedModel = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75
        });
        
        setModel(loadedModel);
        setFeedback('Camera ready. Starting detection...');
        
        // Start the webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
            
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.onloadedmetadata = () => {
                if (canvasRef.current && videoRef.current) {
                  canvasRef.current.width = videoRef.current.videoWidth;
                  canvasRef.current.height = videoRef.current.videoHeight;
                  setIsDetecting(true);
                  setFeedback('Analyzing your pose...');
                  
                  // Initial voice prompt
                  if (poseName === "Squat") {
                    setTimeout(() => {
                      playSound("Get ready for squats. Stand straight with feet shoulder-width apart.");
                    }, 1000);
                  }
                }
              };
            }
          } catch (streamError) {
            console.error('Error accessing webcam:', streamError);
            setFeedback('Error: Cannot access your camera');
            toast.error('Camera access is required for pose detection. Please check your browser permissions.');
          }
        } else {
          setFeedback('Error: Camera access not available');
          toast.error('Your browser does not support webcam access');
        }
      } catch (error) {
        console.error('Error loading PoseNet model:', error);
        setFeedback('Error: Could not load pose detection model');
        toast.error('Failed to initialize pose detection. Please try again later.');
      }
    };

    loadModel();

    return () => {
      // Clean up resources when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (requestAnimationRef.current) {
        cancelAnimationFrame(requestAnimationRef.current);
      }
    };
  }, [poseName, playSound]);

  // Start pose detection once model is loaded and webcam is ready
  useEffect(() => {
    if (!model || !isDetecting) return;

    const detectPose = async () => {
      if (!videoRef.current || !canvasRef.current || !model) return;

      try {
        // Detect poses
        const pose = await model.estimateSinglePose(videoRef.current);
        
        // Draw pose keypoints on canvas
        drawPose(pose);
        
        // Analyze the pose based on exercise type
        const analysis = analyzePoseForExercise(pose, poseName);
        setPoseCorrect(analysis.isCorrect);
        
        // Handle squat-specific tracking
        if (poseName === "Squat") {
          trackSquatProgress(analysis);
        } else {
          setFeedback(analysis.feedback);
        }
        
        // Continue detection loop
        requestAnimationRef.current = requestAnimationFrame(detectPose);
      } catch (error) {
        console.error('Error detecting pose:', error);
        setFeedback('Error occurred during pose detection');
      }
    };

    detectPose();
  }, [model, isDetecting, poseName, playSound]);

  // Track squat progress and count reps
  const trackSquatProgress = (analysis: { isCorrect: boolean; feedback: string; squat?: { depth: number; kneeAngle: number } }) => {
    if (!analysis.squat) return;
    
    const { depth, kneeAngle } = analysis.squat;
    
    // Update max depth if this is deeper than before
    if (depth > maxDepth) {
      setMaxDepth(depth);
    }
    
    // Use ref to track the current position to detect direction change
    if (depth > lastPositionRef.current + 5) {
      // Going down
      if (currentPhase !== 'down') {
        setCurrentPhase('down');
        repInProgressRef.current = true;
      }
    } else if (depth < lastPositionRef.current - 5 && repInProgressRef.current) {
      // Going up after being down
      if (currentPhase !== 'up') {
        setCurrentPhase('up');
        
        // If we went deep enough and now coming up, count as a rep
        if (maxDepth > 30) {
          setRepCount(prev => prev + 1);
          setMaxDepth(0); // Reset max depth for next rep
          playSound("Good rep");
        }
      }
    } else if (depth < 10) {
      // Standing position
      if (currentPhase !== 'waiting') {
        setCurrentPhase('waiting');
        repInProgressRef.current = false;
      }
    }
    
    lastPositionRef.current = depth;
    
    // Provide feedback on form
    if (!analysis.isCorrect) {
      const now = Date.now();
      if (now - lastFeedbackTimeRef.current > feedbackCooldown) {
        playSound(analysis.feedback);
        lastFeedbackTimeRef.current = now;
      }
    }
    
    // Update the visual feedback
    setFeedback(`${analysis.feedback} | Reps: ${repCount} | Depth: ${Math.round(depth)}% | Knee angle: ${Math.round(kneeAngle)}°`);
  };

  // Draw the pose keypoints on the canvas
  const drawPose = (pose: posenet.Pose) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw keypoints
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = poseCorrect ? 'green' : 'red';
        ctx.fill();
      }
    });

    // Draw skeleton lines between keypoints
    const adjacentKeyPoints = [
      ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'],
      ['rightEye', 'rightEar'], ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'leftHip'], ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'], ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'], ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
    ];

    ctx.strokeStyle = poseCorrect ? 'green' : 'red';
    ctx.lineWidth = 2;

    adjacentKeyPoints.forEach(([first, second]) => {
      const firstKeypoint = pose.keypoints.find(kp => kp.part === first);
      const secondKeypoint = pose.keypoints.find(kp => kp.part === second);

      if (firstKeypoint && secondKeypoint && 
          firstKeypoint.score > 0.5 && secondKeypoint.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(firstKeypoint.position.x, firstKeypoint.position.y);
        ctx.lineTo(secondKeypoint.position.x, secondKeypoint.position.y);
        ctx.stroke();
      }
    });
    
    // Draw rep counter and other stats if it's a squat
    if (poseName === "Squat") {
      // Draw semi-transparent background for text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(10, 10, 300, 80);
      
      // Draw text
      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(`Reps: ${repCount}`, 20, 40);
      ctx.fillText(`Depth: ${Math.round(lastPositionRef.current)}%`, 20, 70);
      
      // Draw phase indicator
      ctx.fillStyle = currentPhase === 'down' ? 'yellow' : 
                      currentPhase === 'up' ? 'green' : 'white';
      ctx.beginPath();
      ctx.arc(280, 40, 15, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">{poseName} Pose Detection</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="relative w-full" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted
              width="640"
              height="480"
              style={{ display: 'block', width: '100%' }}
              className="rounded-md"
            />
            <canvas 
              ref={canvasRef}
              width="640"
              height="480"
              className="absolute top-0 left-0"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          
          <div className={`mt-4 p-3 rounded text-center ${poseCorrect ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {feedback}
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose} variant="outline" className="mr-2">Close</Button>
          <Button className="bg-fit-accent hover:bg-fit-accent/90">
            Save Progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PoseDetection;
