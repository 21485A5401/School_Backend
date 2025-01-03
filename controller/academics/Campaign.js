const ClassLevel = require("../../model/Academic/ClassLevel");
const Student = require("../../model/Academic/Student");
const Admin = require("../../model/Staff/Admin");
const Teacher = require("../../model/Staff/Teacher");
const axios = require('axios');
require('dotenv').config();

// Your sendMessage function
const sendWhatsappMessage = async (data) => {
    const config = {
        method: "post",
        url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        data: data,
    };

    return axios(config);
};

const prepareTestTemplate = ({recipient, name, sampleMessage, schoolName}) => {
    
    if (!name || !sampleMessage || !schoolName) {
        throw new Error("All parameters (name, sampleMessage, schoolName) must be provided");
    }

    const data = {
        "messaging_product": "whatsapp",
        "to": recipient,
        "type": "template",
        "template": {
            "name": "custom_message",
            "language": {
                "code": "en"
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        { "type": "text", "text": name },
                        { "type": "text", "text": sampleMessage },
                        { "type": "text", "text": schoolName }
                    ]
                }
            ]
        }
    };
    return JSON.stringify(data);
};




// exports.sendMessage = async (req, res) => {
//     try {
//         const { students, studentMessage, Teachers, teacherMessage } = req.body;
//         if (studentMessage) {
//             // const classes = await ClassLevel.findById(classId);
//             const studentData = await Student.find({ classLevels: classId });
//             console.log(classes);
//             return res.status(200).json({ success: true, studentData });
//         } else if (teacherMessage) {

//         }

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json(error);
//     }
// }

exports.sendMessage = async (req, res) => {
    try {
        const { students, teachers, studentMessage, teacherMessage } = req.body;
        const adminId = req.userAuth._id;
        const AdminData = await Admin.findById(adminId);
        if (!AdminData) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
        // Sending messages to students
        if (studentMessage) {
            // const studentData = await Student.find({ classLevels: classId });
            const studentData = students;
            // console.log(studentData);

            if (!studentData.length) {
                return res.status(404).json({ success: false, message: "No students found." });
            }

            // Split student data into chunks of 100
            const studentChunks = [];
            for (let i = 0; i < studentData.length; i += 100) {
                studentChunks.push(studentData.slice(i, i + 100));
            }

            // Send messages in chunks
            const studentPromises = studentChunks.map(chunk =>
                Promise.all(chunk.map(student => {
                    if (student.whatsappNumber) {
                        const prepareSchema = prepareTestTemplate({
                            recipient: student.whatsappNumber,
                            name: student.name,
                            sampleMessage: studentMessage,
                            schoolName: AdminData.name
                        });
                        sendWhatsappMessage(prepareSchema);
                    }
                }))
            );
            const response = await Promise.all(studentPromises);
            response.forEach((res, index) => {
                // console.log(`Response from promise ${index}:`, res);
            });
            // console.log(response);

        }

        // Sending messages to teachers
        if (teacherMessage) {
            // const teacherData = await Teacher.find({});
            const teacherData = teachers;
            console.log(teacherData);

            if (!teacherData.length) {
                return res.status(404).json({ success: false, message: "No teachers found." });
            }

            // Split teacher data into chunks of 100
            const teacherChunks = [];
            for (let i = 0; i < teacherData.length; i += 100) {
                teacherChunks.push(teacherData.slice(i, i + 100));
            }

            // Send messages in chunks
            const teacherPromises = teacherChunks.map(chunk =>
                Promise.all(chunk.map(teacher => {
                    if (teacher.phone_no) {
                        return sendWhatsappMessage({
                            messaging_product: "whatsapp",
                            to: teacher.phone_no,
                            type: "text",
                            text: { body: teacherMessage },
                        });
                    }
                }))
            );
            await Promise.all(teacherPromises);
        }

        return res.status(200).json({ success: true, message: "Messages sent successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to send messages", error });
    }
};