
export class ValidationResult {
    constructor(messageError = "" , isValid = false , result = ""){
        this.messageError = messageError;
        this.isValid = isValid;
        this.result = result;
    }
}


export class Result {
    constructor(messageError = "" , done = false , result = ""){
        this.messageError = messageError;
        this.done = done;
        this.result = result;
    }
}

