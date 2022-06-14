function pause_log () {
    if (calibrated == 1) {
        pause2 = 1
        datalogger.log(
        datalogger.createCV("roll", avg_roll),
        datalogger.createCV("rvar", roll_var / data_count),
        datalogger.createCV("pitch", avg_pitch),
        datalogger.createCV("pvar", pitch_var / data_count),
        datalogger.createCV("dtime", down_time / data_count),
        datalogger.createCV("datacount", data_count)
        )
        basic.showString("downtime")
        basic.showNumber(down_time / data_count)
        pause2 = 0
    }
}
datalogger.onLogFull(function () {
    pause2 = 1
    music.playTone(262, music.beat(BeatFraction.Breve))
})
input.onButtonPressed(Button.A, function () {
    if (calibrated == 0) {
        front = 1
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
input.onButtonPressed(Button.AB, function () {
    if (control.millis() - last_ab >= 5000) {
        a_b_count = 0
        last_ab = control.millis()
    }
    a_b_count += 1
    if (a_b_count >= 3) {
        if (team_mode == 0) {
            team_mode = 1
            radio.setTransmitSerialNumber(true)
            radio.setGroup(72)
            basic.showString("t")
        } else {
            team_mode = 0
            basic.showString("i")
        }
        a_b_count = 0
    }
    pause_log()
})
radio.onReceivedString(function (receivedString) {
    if (receivedString == "head_tilt_reset" && team_mode == 1) {
        pause2 = 1
        radio.sendValue("roll", avg_roll)
        radio.sendValue("pitch", avg_pitch)
        radio.sendValue("rvar", roll_var)
        radio.sendValue("pvar", pitch_var)
        radio.sendValue("dtime", down_time)
        radio.sendValue("iroll", initial_roll)
        radio.sendValue("ipitch", initial_pitch)
        radio.sendValue("datacount", data_count)
        pause_log()
        reset_vars()
        pause2 = 0
    }
})
input.onButtonPressed(Button.B, function () {
    if (calibrated == 0) {
        initial_pitch = input.rotation(Rotation.Pitch)
        initial_roll = input.rotation(Rotation.Roll)
        reset_vars()
    }
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    pause_log()
})
let pitch_changed = 0
let roll_changed = 0
let a_b_count = 0
let down_time = 0
let pitch_var = 0
let avg_pitch = 0
let data_count = 0
let roll_var = 0
let avg_roll = 0
let front = 0
let last_ab = 0
let team_mode = 0
let pause2 = 0
let calibrated = 0
let initial_pitch = 0
let initial_roll = 0
initial_roll = 100
initial_pitch = 0
calibrated = 0
let threshold = 20
pause2 = 0
team_mode = 0
last_ab = control.millis()
front = 0
datalogger.includeTimestamp(FlashLogTimeStampFormat.Milliseconds)
basic.showString("A front, B back")
loops.everyInterval(500, function () {
    if (calibrated == 1 && pause2 == 0) {
        roll_changed = 0
        pitch_changed = 0
        datalogger.log(datalogger.createCV("rot_pot", input.rotation(Rotation.Pitch)), datalogger.createCV("rot_roll", input.rotation(Rotation.Roll)))
        if (Math.abs(input.rotation(Rotation.Pitch) - initial_pitch) >= threshold) {
            pitch_changed = 1
            pitch_var += 1
            avg_pitch = (data_count * avg_pitch + input.rotation(Rotation.Pitch)) / (data_count + 1)
            if (front == 1) {
                if (input.rotation(Rotation.Pitch) - initial_pitch >= threshold) {
                    down_time += 1
                }
            } else {
                if (initial_pitch - input.rotation(Rotation.Pitch) >= threshold) {
                    down_time += 1
                }
            }
        }
        if (Math.abs(input.rotation(Rotation.Roll) - initial_roll) >= threshold) {
            roll_changed = 1
            roll_var += 1
            avg_roll = (data_count * avg_roll + input.rotation(Rotation.Roll)) / (data_count + 1)
        }
        data_count += 1
    }
})
