import DECREASE from './assets/decrease.png'
import INCREASE from './assets/increase.png'
import MAINTAIN from './assets/maintained.png'
import ABOVE_AVE from './assets/AboveAverage.png'
import MAINTAINED from './assets/MaintainedScore.png'
import LOW from './assets/LowAverage.png'

export const getLabel = (value) => {

    const result = (value >= 1 && value <= 3)
        ? "Below Average"
        : (value >= 4 && value <= 6)
            ? "Average"
            : (value >= 7 && value <= 9)
                ? "Above Average"
                : "Invalid Value";

    return result
}

export const getStanineScore = (value) => {
    const stanineScore = (value >= 96 && value <= 100)
        ? 9
        : (value >= 90 && value <= 95)
            ? 8
            : (value >= 77 && value <= 89)
                ? 7
                : (value >= 60 && value <= 76)
                    ? 6
                    : (value >= 40 && value <= 59)
                        ? 5
                        : (value >= 23 && value <= 39)
                            ? 4
                            : (value >= 11 && value <= 22)
                                ? 3
                                : (value >= 4 && value <= 10)
                                    ? 2
                                    : 1
    return stanineScore
}

export const labelColor = (label) => {
    const color = label == "Below Average" ? 'red' : label == "Average" ? '#94B8FB' : label == "Above Average" ? '#82BC66' : 'black'
    return color
}

export const setIcon = (label) => {
    const icon = label == "Below Average" ? LOW : label == "Average" ? MAINTAINED : label == "Above Average" ? ABOVE_AVE : 'black'
    return icon
}