input.onButtonPressed(Button.A, function () {
    if (calibrated == 0) {
        initial_pitch = input.rotation(Rotation.Pitch)
        initial_roll = input.rotation(Rotation.Roll)
        reset_vars()
    }
})
function reset_vars () {
    avg_roll = 0
    avg_pitch = 0
    roll_var = 0
    pitch_var = 0
    down_time = 0
    data_count = 0
    calibrated = 1
}
let pitch_changed = 0
let roll_changed = 0
let data_count = 0
let down_time = 0
let pitch_var = 0
let roll_var = 0
let avg_pitch = 0
let avg_roll = 0
let calibrated = 0
let initial_pitch = 0
let initial_roll = 0
initial_roll = 100
initial_pitch = 0
calibrated = 0
let threshold = 10
basic.showString("Press A to calibrate")
basic.forever(function () {
    roll_changed = 0
    pitch_changed = 0
    if (calibrated == 1) {
        if (Math.abs(input.rotation(Rotation.Pitch) - initial_pitch) >= threshold) {
            pitch_changed = 1
            pitch_var += 1
        }
        if (Math.abs(input.rotation(Rotation.Roll) - initial_roll) >= threshold) {
            roll_changed = 1
            roll_var += 1
        }
        if (false || false) {
        	
        }
        data_count += 1
    }
})
