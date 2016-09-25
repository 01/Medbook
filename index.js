{
  "intents": [
  
    {
      "intent": "TestFireBase",
      "slots": [
        {
          "name": "Name",
          "type": "AMAZON.GB_FIRST_NAME"
        }
      ]
    },
     
    {
      "intent": "DisplayPatientProfile",
      "slots": [
          {
          "name": "ProfileID",
          "type": "PATIENT_ID"
        }]
    },
      {
        "intent": "DisplayPatientTimeLine",
        "slots": [
          {
          "name": "TimeLineID",
          "type": "PATIENT_ID"
        }]
      },
    {
      "intent": "DisplayPatientAllergies",
      "slots": [
        {
          "name": "AllergiesID",
          "type": "PATIENT_ID"
        }]
    },
    {
      "intent": "DisplayPatientMedications",
      "slots": [
        {
          "name": "MedicationsID",
          "type": "PATIENT_ID"
        }]
    },
    {
      "intents": "DisplayPatientVitals",
      "slots": [
        
         {
          "name": "VitalsID",
          "type": "PATIENT_ID"
        }]
    },
    {
      "intents": "DisplayPatientTestResults",
      "slots": [
         {
          "name": "TestResultsID",
          "type": "PATIENT_ID"
        }
      ]
    },
    {
      "intent": "EmployeeClockIn",
      "slots": [{
      
        	"name": "ClockInId",
        	"type": "EMPLOYEES_ID"
      	}]
    },
    {
      "intent": "getPatientAge",
      "slots": [{
      
        	"name": "patientIDAge",
        	"type": "PATIENT_ID"
      	}]
    },
      {
      "intent": "getPatientBloodType",
      "slots": [{
      
        	"name": "patientIDBlood",
        	"type": "PATIENT_ID"
      	}]
    },
    {
      "intent": "EmployeeClockOut",
      "slots": [{
        	"name": "ClockOutId",
        	"type": "EMPLOYEES_ID"
      	}]
    },
    {
      "intent": "EmployeeTotalHour",
      "slots": [{
        	"name": "TotalHourId",
        	"type": "EMPLOYEES_ID"
      	}]
    },
        {
      "intent": "EmployeeTotalRounds",
      "slots": [{
        	"name": "TotalRounds",
        	"type": "EMPLOYEES_ID"
      	}]
    },

    {
      "intent": "PageDoctor",
      "slots": [{
        	"name": "DoctorName",
        	"type": "DOCTORS_NAME"
      	}]
    },
     {
      "intent": "getPatientCondition",
      "slots": [{
        	"name": "patientIDCondition",
        	"type": "PATIENT_ID"
      	}]
    },
      {
      "intent": "getPatientCat",
      "slots": [{
        	"name": "patientIDcat",
        	"type": "PATIENT_ID"
      	}]
    },
   
    {
      "intent": "PageCodeRed"
    },
	{
      "intent": "PageCodeAmber"
    },
	{
      "intent": "PageCodeBlack"
    },
    {
      "intent": "AMAZON.HelpIntent"
   }
    
  ]
}
