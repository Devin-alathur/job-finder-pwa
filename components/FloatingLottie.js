import Lottie from "lottie-react";
import diceAnimation from "../public/lottie/Animation-dice.json";

export default function FloatingLottie(){
    return(
        <div>
            <Lottie animationData={diceAnimation} loop={true} />
        </div>
    );
}