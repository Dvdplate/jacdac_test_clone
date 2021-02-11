namespace modules {
    /**
     * A sensor that measures liquid/water level.
     **/
    //% fixedInstances blockGap=8
    export class WaterLevelClient extends jacdac.SensorClient<[number]> {
        constructor(role: string) {
            super(jacdac.SRV_WATER_LEVEL, role, "u0.16");
        }
    
        /**
        * The reported water level.
        */
        //% blockId=jacdacwaterlevel_101_0
        //% group="level"
        //% blockCombine block="level" callInDebugger
        get level(): number {
            const values = this.values() as any[];
            return values && values.length > 0 && values[0];
        }

            
    }

    //% fixedInstance whenUsed
    export const waterLevel = new WaterLevelClient("water Level");
}