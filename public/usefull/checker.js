export function emailChecker(data) {

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (data.match(validRegex)) {

        return ""
    } else {

        return "Give us a valid email please."
    }
}

export function passwordLoginChecker(data) {

    if (data.length > 1) {

        return ""
    } else {

        return "Give us a password please."
    }
}

export function nameChecker(data) {

    const validRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u

    if (data.match(validRegex)) {

        return ""
    } else {

        return "Give us a valid name please."
    }
}

export function pseudoChecker(data) {

    const validRegex = /^([A-Za-z0-9\-\_]+)$/

    if (data.match(validRegex)) {

        return ""
    } else {

        return "Your pseudo can only have letters, numbers or '-' '_'."
    }
}

export function passwordChecker(data) {

    const validRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

    if (data.match(validRegex)) {

        return ""
    } else {

        return "UPPERCASE, lowercase, digit, [#?!@$%^&*-], minimum of 8 characters"
    }
}

export function passwordConfChecker(data, refData) {

    if (refData !== data) {

        return "Your passwords don't match"
    } else {

        return ''
    }
}

export function profilChecker(data) {
    
    if (data === "Solver") {

        return "#45C4A2"
    } else if (data === "Leader") {

        return "#E03616"
    } else {
        
        return "#FF7A00"
    }
}