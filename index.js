//REFER TO THIS AS A GUIDE SECTION
//1. HELPER'S FUNCTION
//2. USER'S EXPERIENCE
//3. Events
//4. Main handler

'use strict';

var http = require('http');
var firebase = require('firebase');
var request = require('request');

//---------------------------------------------Test Data ------------------------------------------------------------//
//---------------------------------------------Begining-------------------------------------------------------------//
let EmployeeList = [
    {

    }
];

//---------------------------------------------Test Data ------------------------------------------------------------//
//---------------------------------------------END-------------------------------------------------------------//




//-----------------------------------Obeject/Prototype Definitions------------------------------------------------//
//-----------------------------------Beggining -------------------------------------------------------------------//

function employee(medID, name){
    this.medID = medID;
    this.name = name;
}
function dob (month, day, year){
    this.month = month;
    this.day = day;
    this.year = year;
}

function address(street, city, state, zip){
    this.street = street;
    this.city = city;
    this.state = state;
    this.zip=zip;
}

function patient_(firstName, lastName, age, sex, dob, address, phoneNumber) {
    this.firstName = firstName;
    this.lastnName = lastName;
    this.age = age;
    this.sex = sex;
    this.dob = dob
    this.address = address;
    this.phoneNumber = phoneNumber;

}

function allergies () {
    []
}

function medications(){
    []
}
function existingConditions () {
    []
}
function patient_report(patient, weight, height, isSmokes, isdrinksAlcohol, isPregnant ){
    this.patient = patient;
    this.weight = weight;
    this.height = height;
    this.medications= new medications();
    this.allergies = new allergies();
    this.existingConditions = new existingConditions();
}

function addEmployee(EmployeeList, employee){
    EmployeeList.push(employee)
}

//-----------------------------------Obeject/Prototype Definitions------------------------------------------------//
//-----------------------------------------End-------------------------------------------------------------------//

//--------------------------------------NonAlex Helpers------------------------------------------------------------//
//-------------------------------------Begining -------------------------------------------------------------------//

function addAllergy (patientReport, allergy){
    patientReport.allergies.push(allergy)
}

function addMedication(patientReport, medication){
    patientReport.medications.push(medication)
}

function addExistingCondition(patientReport, condition){
    patientReport.existingConditions.push(condition)
}





// --------------------------------     HELPER'S FUNCTION---------------------------------------------------------//
// ------------------------------------------------BEGINNING ------------------------------------------------------//



function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

function createFavoriteColorAttributes(favoriteColor) {
    return {
        favoriteColor,
    };
}

function getTime(){

    var currentTime = new Date();
    var hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();

    if (minutes < 10){
        minutes = "0" + minutes
    }

    var suffix = "AM";
    if (hours >= 12) {
        suffix = "PM";
        hours = (hours - 12)-4;
    }
    if (hours == 0) {
        hours = 12;
    }

    let timeMe = hours+":"+minutes+" "+ suffix;

    return timeMe;

}

function TestFireBase(intent, session, callback){
    let cardTitle = intent.name;
    let myNameSlot = intent.slots.Name;
    let repromptText = `If you dont know any commands feel free to look on our app or say, ` +
        `ask for help`;
    let speechOutput = '';
    const shouldEndSession = true;
    let sessionAttributes = {};
    if(myNameSlot){
        let myName = myNameSlot.value;
        sessionAttributes = createFavoriteColorAttributes(myName);
        speechOutput = `Hello there king ${myName}.`;
        repromptText = `Was Good in the hood?`;
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }else{
        speechOutput = `I didnt't quite hear your name. Please try again`;
        repromptText = `Are you there? I didnt't quite hear your name. Please try again`;
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    };
}


function TestPhrase(intent, session, callback){
    let cardTitle = intent.name;
    let repromptText = '';
    let speechOutput = 'Lit as fuck';
    const shouldEndSession = true;
    let sessionAttributes = {};



    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

}




// -------------------------------------------    FIREBASE ----------------------------------------------------------//
// ------------------------------------------------BEGINNING ------------------------------------------------------//





// -------------------------------------------    FIREBASE ----------------------------------------------------------//
// ------------------------------------------------ENDING -----------------------------------------------------------//




// -------------------------------------------    USER'S EXPERIENCE ----------------------------------------------------------//
// ------------------------------------------------BEGINNING ------------------------------------------------------//

function getWelcomeResponse(callback) {
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Thank you for using MedBook Service. ' +
        'What can I help you with today?';
    const repromptText = `If you dont know any commands feel free to look on our app for our list of commands`;
    const shouldEndSession = false;
    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for using MedBook. Hope to see you again.';
    const shouldEndSession = true;
    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function setColorInSession(intent, session ,callback) {
    const cardTitle = intent.name;
    const favoriteColorSlot = intent.slots.Color;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    if (favoriteColorSlot) {
        const favoriteColor = favoriteColorSlot.value;
        sessionAttributes = createFavoriteColorAttributes(favoriteColor);
        speechOutput = `I now know your favorite color is ${favoriteColor}. You can ask me ` +
            "your favorite color by saying, what's my favorite color?";
        repromptText = "You can ask me your favorite color by saying, what's my favorite color?";
    } else {
        speechOutput = "I'm not sure what your favorite color is. Please try again.";
        repromptText = "I'm not sure what your favorite color is. You can tell me your " +
            'favorite color by saying, my favorite color is red';
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}



//                                                              //
//                         EMPLOYEES                            //
//                                                              //

//EMPLOYEE CLOCK IN
/*function EmployeeClockIn(intent, session, callback){
    let employeeNumber = intent.slots.ClockInId;
    let repromptText = '';
    let sessionAttributes = {}
    let shouldEndSession = true;
    let speechOutput = '';
    let time = getTime();

    if(employeeNumber){

        let idKey = employeeNumber.value;

        let myObject = {
                clocked_in: "true"
        };
        request({
            url: `https://echoproject-c786f.firebaseio.com/employees/${employeeNumber.value}.json?print=pretty`,
            method: "PATCH",
            body: myObject,
            json: true,
        }, function (error, response){
            if(error) {
                console.log(error);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                for(let i = 0; i < EmployeeList.length; i++){
                    if(EmployeeList[i].medId == idKey){
                        let myName = EmployeeList[i].name;
                        console.log("My Name: " + myName);
                        speechOutput = `Thank you ${myName}. You have clocked in at ${time}`;
                        callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                        break;
                    }
                }
            }
        });
    }else{
        speechOutput = `I'm sorry you either did not state your employee number or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    };



}
*/
//EMPLOYEE CLOCK OUT
/*function EmployeeClockOut(intent, session, callback){
    let employeeNumber = intent.slots.ClockOutId;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';
    let time = getTime();

    if(employeeNumber){
        let idKey = employeeNumber.value;
        let myObject = { clocked_in : "false" };
        request({
            url: `https://echoproject-c786f.firebaseio.com/employees/${employeeNumber.value}.json?print=pretty`,
            method: "PATCH",
            body: myObject,
            json: true,
        }, function(err, response){
           if(err){
               console.log(err);
               speechOutput = `Something went wrong with the request`;
               callback(sessionAttributes,
                   buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
           }else{

               for(let i = 0; i < EmployeeList.length; i++){
                   if(EmployeeList[i].medId == idKey){
                       let myName = EmployeeList[i].name;
                       speechOutput = `Thank you ${myName}. You have clocked out at ${time}`;
                       callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                       break;
                   }
               }
           }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your employee number or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }


}*/

//EMPLOYEE TOTAL HOUR
function EmployeeTotalHour(intent, session, callback){
    let employeeNumber = intent.slots.TotalHourId;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(employeeNumber){
        let idKey = employeeNumber.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/employees/${employeeNumber.value}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let totalHour = response.body.totalHours;
                speechOutput = `Your total hour is. ${totalHour} hours`;
                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your employee number or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}

//EMPLOYEE TOTAL ROUNDS
function EmployeeTotalRounds(intent, session, callback){
    let employeeNumber = intent.slots.TotalRounds;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(employeeNumber){
        let idKey = employeeNumber.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/employees/${employeeNumber.value}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let totalRounds = response.body.rounds_for_today;
                speechOutput = `You have. ${totalRounds} rounds today`;
                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your employee number or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}

/// Get Patient data
function getPatientAge(intent, session, callback){
    let patientID = intent.slots.patientID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_report/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patientAge = response.body.age;
                speechOutput = `The patient's age is ${patientAge}`;
                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}
function getPatientBloodType(intent, session, callback){
    let patientID = intent.slots.patientID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_report/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patientBloodType = response.body.blood_type;
                speechOutput = `The patient's blood type is ${patientBloodType}`;
                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}

function getPatientCondition(intent, session, callback){
    let patientID = intent.slots.patientID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_report/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patientCondition = response.body.condition;
                speechOutput = `The patient's condition is ${patientCondition}`;
                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}

function getPatientRoom(intent, session, callback){
    let patientID = intent.slots.patientID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_report/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patientRoom = response.body.room_number;
                speechOutput = `The patient's blood type is ${patientRoom}`;
                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}

function listPatientMedications(intent, session, callback){
    let patientID = intent.slots.patientID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_report/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patientMedications = response.body.patient_medications;
                var i;
                speechOutput = ("The patient is currently taking " + patientMedications[0].commonBrandName);
                for(i=1; i<patientMedications.length; i++){
                    speechOutput = speechOutput.concat(" and " +patientMedications[i].commonBrandName)
                }
                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}

function listPatientAllergies(intent, session, callback){
    let patientID = intent.slots.patientID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_report/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patientMedications = response.body.allergies;
                var i;
                speechOutput = ("The patient is allergic to " + patientMedications[0].name);
                for(i=1; i<patientMedications.length; i++){
                    speechOutput = speechOutput.concat(" and " +patientMedications[i].name)
                }
                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}

function displayPatientTestResults(intent, session, callback){
    let patientID = intent.slots.PatientProfileID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_record/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patientProfile = response.body.test_results;

                //speechOutput = `The patient's blood type is ${patientRoom}`;
                request({
                    url: `https://echoproject-c786f.firebaseio.com/patient_profile`,
                    body: patientProfile ,
                    method: "POST",
                    json: true,
                }, function(err, response){
                    if(err){
                        console.log(err);
                        speechOutput = `Something went wrong with the request`;
                        callback(sessionAttributes,
                            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }else{
                        let speechOutut = "Display's Patient's Test Results Now"
                        callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }
                });





                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}
function displayPatientInfo(intent, session, callback){
    let patientID = intent.slots.PatientProfileID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_record/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patientProfile = response.body.patient_profile;

                //speechOutput = `The patient's blood type is ${patientRoom}`;
                request({
                    url: `https://echoproject-c786f.firebaseio.com/patient_profile`,
                    body: patientProfile ,
                    method: "POST",
                    json: true,
                }, function(err, response){
                    if(err){
                        console.log(err);
                        speechOutput = `Something went wrong with the request`;
                        callback(sessionAttributes,
                            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }else{
                        let speechOutut = "Display's Patient's Profile Now"
                        callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }
                });





                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}
function displayPatientTimeLine(intent, session, callback){
    let patientID = intent.slots.PatientProfileID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_record/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let medical_time = response.body.Time_Line;

                //speechOutput = `The patient's blood type is ${patientRoom}`;
                request({
                    url: `https://echoproject-c786f.firebaseio.com/medical_time`,
                    body: medical_time ,
                    method: "POST",
                    json: true,
                }, function(err, response){
                    if(err){
                        console.log(err);
                        speechOutput = `Something went wrong with the request`;
                        callback(sessionAttributes,
                            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }else{
                        let speechOutut = "Displaying Patient's Profile Now"
                        callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }
                });





                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.n-ame, speechOutput, repromptText, shouldEndSession));
    }
}
function displayPatientAllergies(intent, session, callback){
    let patientID = intent.slots.PatientProfileID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_record/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let allergies = response.body.allergies;

                //speechOutput = `The patient's blood type is ${patientRoom}`;
                request({
                    url: `https://echoproject-c786f.firebaseio.com/allergies`,
                    body: allergies,
                    method: "POST",
                    json: true,
                }, function(err, response){
                    if(err){
                        console.log(err);
                        speechOutput = `Something went wrong with the request`;
                        callback(sessionAttributes,
                            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }else{
                        let speechOutut = "Displaying Patient's Allergies Now"
                        callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }
                });





                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}
function displayPatientVitals(intent, session, callback){
    let patientID = intent.slots.PatientProfileID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_record/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let patient_vitals = response.body.patient_vitals;

                //speechOutput = `The patient's blood type is ${patientRoom}`;
                request({
                    url: `https://echoproject-c786f.firebaseio.com/patient_vitals`,
                    body: allergies,
                    method: "POST",
                    json: true,
                }, function(err, response){
                    if(err){
                        console.log(err);
                        speechOutput = `Something went wrong with the request`;
                        callback(sessionAttributes,
                            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }else{
                        let speechOutut = "Displaying Patient's Vitals Now"
                        callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }
                });





                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}

function displayMedications(intent, session, callback){
    let patientID = intent.slots.PatientProfileID;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(patientID){
        let idKey = patientID.value;
        request({
            url: `https://echoproject-c786f.firebaseio.com/patient_record/${idKey}.json?print=pretty`,
            method: "GET",
            json: true,
        }, function(err, response){
            if(err){
                console.log(err);
                speechOutput = `Something went wrong with the request`;
                callback(sessionAttributes,
                    buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }else{
                let medications = response.body.medications;

                //speechOutput = `The patient's blood type is ${patientRoom}`;
                request({
                    url: `https://echoproject-c786f.firebaseio.com/medications`,
                    body: allergies,
                    method: "POST",
                    json: true,
                }, function(err, response){
                    if(err){
                        console.log(err);
                        speechOutput = `Something went wrong with the request`;
                        callback(sessionAttributes,
                            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }else{
                        let speechOutut = "Displaying Patient's Medications Now"
                        callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
                    }
                });





                callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
            }
        });

    }else{
        speechOutput = `I'm sorry you either did not state your patient id or it was incorrect." + "If you have lost it please look back into your mobile app to retreive it`;
        callback(sessionAttributes,
            buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }
}
//                                                              //
//                         ALARMS                               //
//                                                              //

//CODE RED
function PageCodeRed(intent, session, callback){
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';
    speechOutput = `Code Red is now activated`;
    callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

//CODE AMBER
function PageCodeAmber(intent, session, callback){
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';
    speechOutput = `Code Amber is now activated`;
    callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

//CODE BLACK
function PageCodeBlack(intent, session, callback){
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';
    speechOutput = `Code Black is now activated`;
    callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}


//                                                              //
//                         PAGING                               //
//                                                              //

//PAGE DOCTOR
function PageDoctor(intent, session, callback){
    let doctorName = intent.slots.DoctorName;
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';

    if(doctorName){
        let docName = doctorName.value;
        speechOutput = `${docName} has been paged`;
        callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
    }else{
        speechOutput = `Please Say a Doctor Name after the command`;
        callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));

    }
}

//                                                              //
//                         PATIENTS                            //
//                                                              //

//TOTAL NUMBER OF PATIENTS
function TotalNumberOfPatients(intent, session, callback){
    let repromptText = '';
    let sessionAttributes = {};
    let shouldEndSession = true;
    let speechOutput = '';
    request({
        url: `https://echoproject-c786f.firebaseio.com/patients.json?print=pretty`,
        method: "GET",
        json: true,
    }, function(err, response){
        if(err){
            console.log(err);
            speechOutput = `Something went wrong with the request`;
            callback(sessionAttributes,
                buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        }else{
            console.log("***********************************");
            console.log(response.body);
            let addMe = 0;
            let i;
            for(i in response.body){
                addMe++;
            };
            let totalPatients = addMe;
            speechOutput = `You have. ${totalPatients} patients in total in this hospital`;
            callback(sessionAttributes,buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        }
    });
}



//                                                              //
//                         INFORMATION                          //
//                                                              //



// -------------------------------------------    USER'S EXPERIENCE ----------------------------------------------------------//
// -------------------------------------------    ENDING            ----------------------------------------------------------//







// -------------------------------------------    Events ----------------------------------------------------------//
// ------------------------------------------------BEGINNING ------------------------------------------------------//


function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}


function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'MyColorIsIntent') {
        setColorInSession(intent, session, callback);
    } else if (intentName === 'WhatsMyColorIntent') {
        getColorFromSession(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    }
    else if(intentName === 'DisplayPatientProfile') {
        displayPatientInfo(intent, session, callback);
    }
    else if(intentName === 'DisplayPatientAllergies') {
        displayPatientAllergies(intent, session, callback);
    }
    else if(intentName === 'DisplayPatientMedications') {
        displayMedications(intent, session, callback);
    }
    else if(intentName === 'DisplayPatientVitals') {
        displayPatientVitals(intent, session, callback);
    }
    else if(intentName === 'DisplayPatientTestResults') {
        displayPatientTestResults(intent, session, callback);
    }
    else if(intentName === 'ListPatientMedications') {
        listPatientMedications(intent, session, callback);
    }
    else if(intentName === 'ListPatienAllergies') {
        listPatientAllergies(intent, session, callback);
    else if(intentName === 'GenerateFullReport'){

    }
    else if(intentName === 'GenerateFullReport'){

    }
    //                                                              //
    //                         EMPLOYEES                            //
    //                                                              //

    //EMPLOYEES CHECK IN
    else if(intentName === 'EmployeeClockIn') {
        EmployeeClockIn(intent, session, callback);
    }
    else if(intentName === 'getPatientAge'){
        getPatientAge(intent, session, callback);
    }
    else if(intentName === 'getPatientBloodType'){
        getPatientBloodType(intent, session, callback);
    }
    else if(intentName === 'getPatientCondition'){
        getPatientCondition(intent, session, callback);
    }
    else if(intentName === 'getPatientRoom'){
        getPatientRoom(intent, session, callback);
    }
    //EMPLOYEES CHECK IN
    else if(intentName === 'EmployeeClockOut') {
        EmployeeClockOut(intent, session, callback);
    }
    //EMPLOYEES TOTAL HOUR
    else if(intentName === 'EmployeeTotalHour') {
        EmployeeTotalHour(intent, session, callback);
    }
    //EMPLOYEES Total SURGERY
    else if(intentName === 'EmployeeTotalSurgeryLogged') {
        EmployeeTotalSurgeryLogged(intent, session, callback);
    }
    //EMPLOYEES TOTAL HOUR
    else if(intentName === 'EmployeeTotalRounds') {
        EmployeeTotalRounds(intent, session, callback);
    }
    else if(intentName === 'ListPatientMedications') {
        listPatientMedications(intent, session, callback);
    }


    //                         Sugeries                             //

    else if(intentName === 'TotalSurgeries') {
        TotalSurgeries(intent, session, callback);
    }

    //              ALARMS                       //

    else if(intentName === 'PageCodeRed') {
        PageCodeRed(intent, session, callback);
    }

    else if(intentName === 'PageCodeAmber') {
        PageCodeAmber(intent, session, callback);
    }

    else if(intentName === 'PageCodeBlack') {
        PageCodeBlack(intent, session, callback);
    }

    //               PAGING                      //

    else if(intentName === 'PageDoctor') {
        PageDoctor(intent, session, callback);
    }

    //               PATIENTS                    //

    else if(intentName === 'TotalNumberOfPatients') {
        TotalNumberOfPatients(intent, session, callback);
    }

    else if(intentName === 'CheckPatientStatus') {
        CheckPatientStatus(intent, session, callback);
    }
    else if(intentName === 'CheckPatientInfo'){
        CheckPatientInfo(intent, session, callback);
    }

    //                         INFORMATION                          //

    else if(intentName === 'TestFireBase') {
        TestFireBase(intent, session, callback);
    }
    else if(intentName === 'TestPhrase') {
        TestPhrase(intent, session, callback);
    }
    else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}

// -------------------------------------------    Events ----------------------------------------------------------//
// -------------------------------------------    ENDING ----------------------------------------------------------//






// ------------------------------------------------Main handler ------------------------------------------------------//
// ------------------------------------------------BEGINNING ------------------------------------------------------//

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {


    try {

        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

         // if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
         // callback('Invalid Application ID');
         // }


        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    request({
                        url: `https://echoserver162.herokuapp.com/echo/apidata`,
                        method: "POST",
                        body: speechletResponse,
                        json: true,
                    }, function(err, response){
                        if(err){
                            console.log(err);
                        }else{
                            console.log("Connect to middle server successfully!");
                        }
                    });
                    console.log(speechletResponse);
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    request({
                        url: `https://echoserver162.herokuapp.com/echo/apidata`,
                        method: "POST",
                        body: speechletResponse,
                        json: true,
                    }, function(err, response){
                        if(err){
                            console.log(err);
                        }else{
                            console.log("Connect to middle server successfully!");
                        }
                    });
                    console.log(speechletResponse);
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};


// ------------------------------------------------Main handler ------------------------------------------------------//
// ------------------------------------------------ENDING ------------------------------------------------------//
