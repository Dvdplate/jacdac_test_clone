namespace modules {
    /**
     * A sensor measuring air pressure of outside environment.
     **/
    //% fixedInstances blockGap=8
    export class BarometerClient extends jacdac.SensorClient<[number]> {
        constructor(role: string) {
            super(jacdac.SRV_BAROMETER, role, "u22.10");
        }
    
        /**
        * The air pressure.
        */
        //% blockId=jacdacbarometer_101_0
        //% group="pressure"
        //% blockCombine block="pressure" callInDebugger
        get pressure(): number {
            const values = this.values() as any[];
            return values && values.length > 0 && values[0];
        }

            
    }

    //% fixedInstance whenUsed
    export const barometer = new BarometerClient("barometer");
}