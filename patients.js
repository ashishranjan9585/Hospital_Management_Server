import { hospitalData } from "./hospitalData";
import express from "express";

const app = express();

app.use(express.json());

//1. Get the hospital information
app.get("/hospital" , (req , res) => {
    const {name  , contact  , location} = hospitalData?.hospital;
    res.json({
        name ,
        location ,
        contact,
    });
});

//2. Get all patients 
app.get("/patients" , (req , res) => {
    const patients = hospitalData?.medicalStaff?.patients;
    res.json({
        patients,
    });
});

//3. Add a new patients
app.post("/patients" , (req , res) => {
    const newPatient =  req.body;
    console.log("Received data :" , newPatient);
    hospitalData?.medicalStaff?.patients.push(newPatient);
    res.json({
        success : true ,
        msg : "New Patient Added!",
    });
});

//4. Update a Patient
app.put("/patients" , (req ,res) => {
    const patientId = parseInt(req.params.id);
    const updatedPatient = req.body;

    console.log("Received data:" , updatedPatient);

    const index = hospitalData?.medicalStaff?.patients.findIndex(
      (patients) => patients.id === patientId 
    );

    if(
        hospitalData &&
        hospitalData.medicalStaff &&
        hospitalData.medicalStaff.patients &&
        hospitalData.medicalStaff.patients[index] !== undefined
    ) {
        //Replace  the entire  patient object  with the updated data
        hospitalData.medicalStaff.patients[index] = updatedPatient;
        res.json({
            success: true ,
            msg : "Patient update successfully"
    });
    } else{
        res.status(500).json({
            success : false ,
            msg : "Internal Server Error : Unable to update patient"
        });
    }
});

//5. Delete  Patient

app.delete("/patient/:id" , (req , res) => {
    const patientId = parseInt(req.params.id);
    hospitalData.medicalStaff.patients.filter(
        (patient) => patient.id !== patientId
    );
    res.json({
        success : true ,
        msg : "Patient Deleted Successfully!"
});
});

//6. Get a Specific Patient By Id
app.get("/patients/:id" , (req , res) => {
    const patientId = parseInt(req.params.id);
   const patient = hospitalData.medicalStaff.patients.find(
        (patient) => patient.id === patientId
    );
    if(patient) {
        res.json({
            patient ,
        });
    } else{
        res.status(404).json({
            msg : "Patient Not Found"
        });
    }
});

app.listen(3001 , () => {
    console.log("Server is running on port 3001");
});