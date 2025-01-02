const Classes = require("../../model/newmodels/classes");
const Section = require("../../model/newmodels/section");
const newStudent = require("../../model/newmodels/Student");

// class APIs

exports.addClasses = async (req, res) => {
    try {
        const { name } = req.body;
        const checkclass = await Classes.findOne({ name, createdBy: req.userAuth._id });
        if (checkclass) {
            return res.status(400).json({ success: true, message: "Class already exists" });
        }
        await Classes.create({ name, createdBy: req.userAuth._id });
        return res.status(201).json({ success: true, message: "Class created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
exports.getClasses = async (req, res) => {
    try {
        const adminId = req.userAuth._id;
        const classes = await Classes.find({ createdBy: adminId }).populate({ path: 'sections' });
        return res.status(200).json({ success: true, data: classes });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
exports.updateClasses = async (req, res) => {
    try {
        const { id, name } = req.body;
        const checkclass = await Classes.findOne({ _id: id, createdBy: req.userAuth._id });
        if (!checkclass) {
            return res.status(400).json({ success: false, message: "Class does not Found" });
        }
        const updatedclass = await Classes.findByIdAndUpdate(id, { name }, { new: true });
        return res.status(200).json({ success: true, data: updatedclass, message: "Class Name Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

// Section APIs

exports.addSection = async (req, res) => {
    try {
        const { name, classId } = req.body;
        const checksection = await Section.find({
            name: { $regex: new RegExp(`^${name}$`, "i") } // Case-insensitive exact match
        });
        const checkclass = await Classes.find({
            _id: classId,
            sections: { $in: checksection.map(section => section._id) }
        });

        console.log(checksection);
        console.log(checkclass);

        if (checkclass.length > 0) {
            return res.status(400).json({ success: true, message: "section already exists" });
        }
        // if (checksection) {
        //     return res.status(400).json({ success: true, message: "section already exists" });
        // }
        const section = await Section.create({ name, createdBy: req.userAuth._id });
        await Classes.findByIdAndUpdate(
            classId,
            { $push: { sections: section._id } },
            { new: true }
        );
        return res.status(201).json({ success: true, message: "Class created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

exports.getClassById = async (req, res) => {
    try {
        const { id } = req.query;
        const sections = await Classes.findById(id).populate({ path: 'sections' })
        return res.status(200).json({ success: true, data: sections });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

exports.getSection = async (req, res) => {
    try {
        const adminId = req.userAuth._id;
        const sections = await Section.find({ createdBy: adminId });
        return res.status(200).json({ success: true, data: sections });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
exports.getSectionbyId = async (req, res) => {
    try {
        const { id } = req.query;
        const sections = await Section.findById(id).populate({ path: 'students' });
        return res.status(200).json({ success: true, data: sections });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

exports.updateSection = async (req, res) => {
    try {
        const { id, name } = req.body;
        const checksection = await Section.findOne({ _id: id, createdBy: req.userAuth._id });
        const checksectionname = await Section.findOne({ name: name, createdBy: req.userAuth._id });
        if (!checksection) {
            return res.status(400).json({ success: true, message: "Section does not Found" });
        }
        if (checksectionname) {
            return res.status(400).json({ success: true, message: "Section Name Already Exist" });
        }
        const updatedsection = await Section.findByIdAndUpdate(id, { name }, { new: true });
        return res.status(200).json({ success: true, data: updatedsection });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

// Student Routes
exports.addStudent = async (req, res) => {
    try {
        const { name, rollno, fatherName, whatsappNumber, gender, students, sectionId, classId } = req.body;

        if (sectionId) {
            const section = await Section.findById(sectionId);
            if (!section) {
                return res.status(400).json({ success: false, message: "Section does not exist" });
            }
        }

        if (students) {
            if (!Array.isArray(students) || students.length === 0) {
                return res.status(400).json({ success: false, message: "Invalid input: students must be a non-empty array" });
            }

            // Add the createdBy field to each student record
            const studentData = students.map(student => ({
                ...student,
                createdBy: req.userAuth._id,
                section: sectionId,
                classId
            }));

            // Insert all students at once
            const result = await newStudent.insertMany(studentData);

            if (sectionId) {
                const studentIds = result.map(student => student._id);
                await Section.findByIdAndUpdate(
                    sectionId,
                    { $push: { students: { $each: studentIds } } },
                    { new: true }
                );
            }

            return res.status(201).json({
                success: true,
                message: `${result.length} students created successfully`,
                data: result
            });
        } else {
            const student = await newStudent.create({
                name,
                rollno,
                fatherName,
                whatsappNumber,
                gender,
                createdBy: req.userAuth._id,
                section: sectionId,
                classId
            });

            if (sectionId) {
                await Section.findByIdAndUpdate(
                    sectionId,
                    { $push: { students: student._id } },
                    { new: true }
                );
            }
            return res.status(201).json({ success: true, message: "Student created successfully" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

exports.getStudents = async (req, res) => {
    try {
        const adminId = req.userAuth._id;
        const { count } = req.query;
        let students;
        if (count) {
            students = await newStudent.countDocuments({ createdBy: adminId });
        } else {
            students = await newStudent.find({ createdBy: adminId });
        }
        return res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}