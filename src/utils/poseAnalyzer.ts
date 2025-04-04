
import * as posenet from '@tensorflow-models/posenet';

interface PoseAnalysisResult {
  isCorrect: boolean;
  feedback: string;
  squat?: {
    depth: number;
    kneeAngle: number;
  };
}

// Helper function to calculate angle between three points
const calculateAngle = (a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}) => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
};

// Calculate the distance between two points
const calculateDistance = (a: {x: number, y: number}, b: {x: number, y: number}) => {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
};

// Check if a keypoint is detected with enough confidence
const isKeypointConfident = (keypoint: posenet.Keypoint | undefined, threshold = 0.5): boolean => {
  return !!keypoint && keypoint.score > threshold;
};

// Find a keypoint by part name
const findKeypoint = (pose: posenet.Pose, part: string): posenet.Keypoint | undefined => {
  return pose.keypoints.find(kp => kp.part === part);
};

// Analyze Downward Dog pose
const analyzeDownwardDog = (pose: posenet.Pose): PoseAnalysisResult => {
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
    
    if (isCorrect) {
      return { 
        isCorrect: true, 
        feedback: 'Great job! Your Downward Dog pose looks correct.'
      };
    } else {
      return { 
        isCorrect: false, 
        feedback: 'Adjust your pose. Hips should be higher, arms and legs straight.'
      };
    }
  } else {
    return { 
      isCorrect: false, 
      feedback: 'Make sure your full body is visible to the camera'
    };
  }
};

// Analyze Squat pose
const analyzeSquat = (pose: posenet.Pose): PoseAnalysisResult => {
  // Get necessary keypoints
  const leftHip = findKeypoint(pose, 'leftHip');
  const rightHip = findKeypoint(pose, 'rightHip');
  const leftKnee = findKeypoint(pose, 'leftKnee');
  const rightKnee = findKeypoint(pose, 'rightKnee');
  const leftAnkle = findKeypoint(pose, 'leftAnkle');
  const rightAnkle = findKeypoint(pose, 'rightAnkle');
  const leftShoulder = findKeypoint(pose, 'leftShoulder');
  const rightShoulder = findKeypoint(pose, 'rightShoulder');
  
  // Check if all necessary keypoints are detected with good confidence
  const allKeypointsVisible = isKeypointConfident(leftHip) && isKeypointConfident(rightHip) &&
    isKeypointConfident(leftKnee) && isKeypointConfident(rightKnee) &&
    isKeypointConfident(leftAnkle) && isKeypointConfident(rightAnkle) &&
    isKeypointConfident(leftShoulder) && isKeypointConfident(rightShoulder);
    
  if (!allKeypointsVisible) {
    return {
      isCorrect: false,
      feedback: 'Position yourself so your full body is visible',
      squat: {
        depth: 0,
        kneeAngle: 180
      }
    };
  }
  
  // Calculate knee angles
  const leftKneeAngle = calculateAngle(
    { x: leftHip!.position.x, y: leftHip!.position.y },
    { x: leftKnee!.position.x, y: leftKnee!.position.y },
    { x: leftAnkle!.position.x, y: leftAnkle!.position.y }
  );
  
  const rightKneeAngle = calculateAngle(
    { x: rightHip!.position.x, y: rightHip!.position.y },
    { x: rightKnee!.position.x, y: rightKnee!.position.y },
    { x: rightAnkle!.position.x, y: rightAnkle!.position.y }
  );
  
  // Calculate average knee angle
  const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
  
  // Calculate squat depth as a percentage (0% is standing, 100% is full depth)
  // Standing knee angle is around 170-180 degrees, deep squat is around 70-90 degrees
  const depthPercentage = Math.max(0, Math.min(100, ((180 - avgKneeAngle) / 90) * 100));
  
  // Check for common squat form issues
  let feedback = 'Good squat form';
  let isCorrect = true;
  
  // Check if knees are going too far forward (past toes)
  const leftKneeForward = leftKnee!.position.x < leftAnkle!.position.x - 30;
  const rightKneeForward = rightKnee!.position.x > rightAnkle!.position.x + 30;
  
  if (leftKneeForward || rightKneeForward) {
    feedback = 'Keep your knees behind your toes';
    isCorrect = false;
  }
  
  // Check if back is straight (shoulders should be aligned with hips horizontally in a proper squat)
  const shoulderHipYDiff = Math.abs(
    (leftShoulder!.position.y + rightShoulder!.position.y) / 2 - 
    (leftHip!.position.y + rightHip!.position.y) / 2
  );
  
  const shoulderHipXDiff = Math.abs(
    (leftShoulder!.position.x + rightShoulder!.position.x) / 2 - 
    (leftHip!.position.x + rightHip!.position.x) / 2
  );
  
  if (shoulderHipXDiff > 50) {
    feedback = 'Keep your back straight and chest up';
    isCorrect = false;
  }
  
  // Check if squat is deep enough (when in the down position)
  if (depthPercentage > 20 && depthPercentage < 50 && avgKneeAngle > 120) {
    feedback = 'Try to squat deeper';
    isCorrect = false;
  }
  
  // Check if feet are too close together
  const ankleDistance = calculateDistance(
    { x: leftAnkle!.position.x, y: leftAnkle!.position.y },
    { x: rightAnkle!.position.x, y: rightAnkle!.position.y }
  );
  
  const shoulderDistance = calculateDistance(
    { x: leftShoulder!.position.x, y: leftShoulder!.position.y },
    { x: rightShoulder!.position.x, y: rightShoulder!.position.y }
  );
  
  if (ankleDistance < shoulderDistance * 0.7) {
    feedback = 'Widen your stance to shoulder width';
    isCorrect = false;
  }
  
  return {
    isCorrect,
    feedback,
    squat: {
      depth: depthPercentage,
      kneeAngle: avgKneeAngle
    }
  };
};

// Main function to analyze pose based on exercise type
export const analyzePoseForExercise = (pose: posenet.Pose, exerciseName: string): PoseAnalysisResult => {
  switch (exerciseName) {
    case 'Downward Dog':
      return analyzeDownwardDog(pose);
    case 'Squat':
      return analyzeSquat(pose);
    default:
      return {
        isCorrect: false,
        feedback: `Analyzing ${exerciseName} pose...`
      };
  }
};
