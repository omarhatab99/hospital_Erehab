import { getSingleDoctorById } from "./doctors";

let params = new URLSearchParams(location.search);
const id = params.get('id');


//handle doctor details

const detailsDoctor = () => {
    displayTargetdoctor();

    document.querySelector(".doctor-information-header").addEventListener("click" , () => {
        location.assign(`/Adminpanel/Doctors/Update.html?id=${id}`);
    })
}
//get single doctor and display it
const displayTargetdoctor = async() => {
    const doctor = await getSingleDoctorById(id);
 
    document.getElementById("previewImg").src = (doctor.profileImage.imageUrl)
     ? doctor.profileImage.imageUrl
     : "assets/images/avatar-placeholder.png";

    //handle doctor information
    document.querySelector(".doctor-name").textContent = doctor.name;
    document.querySelector(".doctor-specialization").textContent = doctor.specialization;
    document.querySelector(".doctor-description").innerHTML = (doctor.description)
     ? doctor.description
    :
    `
    A doctor is responsible for all sides of care of a patient. They diagnose,
     educate, and treat patients to ensure that they have the best possible care.
      A few of the main duties of a doctor are performing diagnostic tests,
       recommending specialists for patients, document patient's medical history,
        and educating patients. 

    
    
    `;

}


detailsDoctor();
