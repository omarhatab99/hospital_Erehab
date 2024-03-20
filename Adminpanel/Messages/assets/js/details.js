//imports
import moment from "moment";
import { getMessageById } from "./messages";

//constants

let params = new URLSearchParams(location.search);
let id = params.has('id') ? params.get('id') : undefined;

const handleMessageDetails = () => {
    displayTargetMessage();
}

//get single product and display it
const displayTargetMessage = async() => {
    const message = await getMessageById(id);


    document.querySelector(".message-content").textContent = message.message;
    document.querySelector(".customer-username").textContent = message.username;
    document.querySelector(".customer-email").textContent = message.email;
    document.querySelector(".message-sended-at").textContent = moment(message.createAt).format('MMMM Do YYYY, h:mm:ss a');


}


handleMessageDetails();