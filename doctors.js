import { hospitalData } from "./hospitalData.js";
import express from "express";

const app = express();
import {v4 as uuidv4} from "uuid";

app.use(express.json());

/*    
         1. Fetches the list  of doctors  in the medical staff ,
        2. Can include additional query parameters for filtering , storing and pagination.

        ENDPOINT : hhtp://localhost:3002/medical-staff/doctors?sortBy=name&department=Dermatology

 */


 let doctors = hospitalData.medicalStaff.doctors;
 
 //******************************************************************************************************************************************* */

 app.get("/medical-staff/doctors" , (req ,res) => {
    try {
        if(!doctors){
            throw new Error("Doctor data is not available");
        }

        const { department , sortBy} = req.query;
        let filteredDoctors = [...doctors];

        if(department){
            filteredDoctors = filteredDoctors.filter(
                (doctor) => doctor.department === department
            );
        }
        if(sortBy === "name") {
            filteredDoctors.sort((a ,b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            
            );
        }
        res.json({
            doctors : filteredDoctors ,
        })
    } catch(error){
        console.log("Error:" , error.msg);
        res.status(500).json({error : "Internal Server Error!"});
    }
 })


 //********************************************************************************************************* */

 /*
   1. Adds a new doctor  to the medical staff .
   2. Validate required feilds(name , department , specialist) in the  incoming  request
   3. Respond with an error if essential information is missing 
   4. Generate a  unique ID  for the new  doctor  using the generateUniqueId function
   5. Respond with the success message and details of the newly created doctor

   */

   function generateUniqueId() {
      return uuidv4();
   }

   app.post("/medical-staff/doctors" , (req ,res) => {
        const newDoctor = req.body;

        newDoctor.id = generateUniqueId();
        if(!newDoctor.name || !newDoctor.department){
            return res.status(400).json({
                msg : "Name and Department are Required",
            });
        }

        doctors.push(newDoctor);
        res.status(201).json({
            msg : "Doctor Created Successfully" ,
            doctor : newDoctor,
        });
   });

//************************************************************************************************************** */

/*
   1. Updates an existing doctor in the medical staff
   2. Validates required fields for updates (name , department , specialty).
   3. Checks  if the doctor  exists  based  on the provided ID.
   4. Applies  complex  update logic , preserving  existing data
   
   */


   app.put("/medical-staff/doctors/:id" , (req, res) => {
    const doctorId = parseInt(req.params.id);
    const updatedDoctor = req.body;

    if(!updatedDoctor.name || !updatedDoctor.department) {
        res.status(400).json({
           msg : "Name  and Department are Required" ,
    }) ;
    }

    const index = doctors.findIndex((doctor) => doctor.id === doctorId);
    if(index === -1) {
        doctors[index] = {...doctors[index] , updatedDoctor};
        res.json({
            msg : "Doctor updated Successfully" ,
            doctor : doctors[index] ,
        });
    } else{
           res.status(404).json({msg : "Doctor not found"});
    }
   });

   //*************************************************************************************************** */

   /* 
      1. Deletes  a doctor  from the medical staff
      2. Checks if  the doctor with the provided ID exists.
      3. Removes the doctor and handles associated data(e.g.. Patient records , appointments)
*/

app.delete("/medical-staff/doctors/:id" , (req ,res) => {
    const  doctorId = parseInt(req.params.id);
    doctors = doctors.filter((doctor) => doctor.id !== doctorId);
    console.log(doctors);
    res.json({
        success : true ,
        msg : "Successfully deleted the doctor" ,
    });
});

app.listen(3002 , () => {
    console.log("Server is Running on PORT 3002");
});

