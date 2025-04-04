
import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  }, []);

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
        
        // Check if the pose is correct (for Downward Dog)
        analyzePose(pose);
        
        // Continue detection loop
        requestAnimationRef.current = requestAnimationFrame(detectPose);
      } catch (error) {
        console.error('Error detecting pose:', error);
        setFeedback('Error occurred during pose detection');
      }
    };

    detectPose();
  }, [model, isDetecting]);

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
  };

  // Analyze the detected pose and check if it matches Downward Dog
  const analyzePose = (pose: posenet.Pose) => {
    // Simple example for "Downward Dog" - these thresholds would need adjustments based on testing
    if (poseName === "Downward Dog") {
      const wrists = pose.keypoints.filter(kp => kp.part.includes('Wrist') && kp.score > 0.5);
      const ankles = pose.keypoints.filter(kp => kp.part.includes('Ankle') && kp.score > 0.5);
      const hips = pose.keypoints.filter(kp => kp.part.includes('Hip') && kp.score > 0.5);
      const shoulders = pose.keypoints.filter(kp => kp.part.includes('Shoulder') && kp.score > 0.5);
      
      if (wrists.length === 2 && ankles.length === 2 && hips.length === 2 && shoulders.length === 2) {
        // Calculate if hips are higher than shoulders (characteristic of Downward Dog)
        const avgHipY = (hips[0].position.y + hips[1].position.y) / 2;
        const avgShoulderY = (shoulders[0].position.y + shoulders[1].position.y) / 2;
        
        // Calculate if arms and legs are straight
        const armsExtended = wrists.every((wrist, i) => {
          return Math.abs(wrist.position.y - shoulders[i].position.y) > 100;
        });
        
        const legsExtended = ankles.every((ankle, i) => {
          return Math.abs(ankle.position.y - hips[i].position.y) > 100;
        });
        
        // Check if the body forms an inverted V-shape
        const isCorrect = avgHipY < avgShoulderY && armsExtended && legsExtended;
        
        setPoseCorrect(isCorrect);
        
        if (isCorrect) {
          setFeedback('Great job! Your Downward Dog pose looks correct.');
        } else {
          setFeedback('Adjust your pose. Hips should be higher, arms and legs straight.');
        }
      } else {
        setFeedback('Make sure your full body is visible to the camera');
        setPoseCorrect(false);
      }
    } else {
      setFeedback(`Analyzing ${poseName} pose...`);
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
