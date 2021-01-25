export const STATE_IDLE = 0;
export const STATE_PREALARM = 1;
export const STATE_ALARM = 2;
export const STATE_ALERT = 3;
export const STATE_TAPE = 4;

const stateStrings = new Array();
stateStrings[STATE_IDLE] = "Idle";
stateStrings[STATE_PREALARM] = "Idle";
stateStrings[STATE_ALARM] = "Alarm";
stateStrings[STATE_ALERT] = "Alert";
stateStrings[STATE_TAPE] = "Record";

export default stateStrings;
