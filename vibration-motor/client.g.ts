namespace modules {
    /**
     * A vibration motor.
     **/
    //% fixedInstances blockGap=8
    export class VibrationMotorClient extends jacdac.SensorClient<[number]> {
        constructor(role: string) {
            super(jacdac.SRV_VIBRATION_MOTOR, role, "u0.8");
        }
    
        /**
        * Rotation speed of the motor. If only one rotation speed is supported,
        * then `0` shell be off, and any other number on. 
        * Use the ``vibrate`` command to control the register.
        */
        //% blockId=jacdacvibration_101_0
        //% group="speed"
        //% blockCombine block="speed" callInDebugger
        get speed(): number {
            const values = this.values() as any[];
            return values && values.length > 0 && values[0];
        }

            
    }

    //% fixedInstance whenUsed
    export const vibrationMotor = new VibrationMotorClient("vibration Motor");
}