const Faculty = require('../models/Faculty')
const Sessions = require('../models/Session');
const DeptWiseFaculty = require('../models/deptwiseFaculty');

const getAllFaculty = async (req, res) => {
    try {
        const result = await DeptWiseFaculty.find({ show: true }).sort({order:1}).select("-password");
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json("Error: " + error);
    }
}

const getByIdFaculty = async (req, res) => {
    try {
        const result = await Faculty.find({ _id: req.params.id }).select("-password");
        res.status(200).json({ data: result, validation: req.user });
    } catch (error) {
        res.status(400).json("Error: " + error);
    }
}

const getByDeptFaculty = async (req, res) => {
    try {
        const doc = await DeptWiseFaculty.findOne({ department: req.params.dept }).lean();
        const result = await DeptWiseFaculty.findOne({ department: req.params.dept }).populate('faculty.ID', 'name address img position education_qualification address gender email dob father_name designation nationality book_publications conference_publications admin_responsibility patent phd_dissertion phd_supervised awards affiliations research_profile research_project personal_link journal event sourceOfInfo show').lean();
        
        const finalResult = {...doc, ...result};
        
        let facultyMappedWithTrue = finalResult['faculty'].filter((fcl) => {
            return fcl['ID']['show'];
        });

        // console.log(facultyMappedWithTrue);
        // facultyMappedWithTrue = facultyMappedWithTrue.map((f) => {
        //     let fc = faculty.find((ele) => ele.ID.toString()===f.ID._id.toString())
        //     f['designation'] = fc['position']
        //     return f
        // })

        res.status(200).json(facultyMappedWithTrue);
    } catch (error) {
        res.status(400).json("Error: " + error);
    }
}

const addFaculty = async (req, res) => {
    const faculty = new Faculty({ ...req.body, department: req.params.dept });

    try {
        const result = await faculty.save();
        res.status(201).json("Successfully inserted")
    } catch (error) {
        res.status(400).json("Error: " + error);
    }
}

const deleteFaculty = async (req, res) => {
    try {
        const result = await Faculty.findByIdAndUpdate(req.params.id, { $set: { show: false } });
        res.status(200).json("Faculty deleted succesfully")
    } catch (error) {
        res.status(400).json("Error: " + error);

    }
}

const updateFaculty = async (req, res) => {
    try {
        if(req.user.login && req.user.isFaculty){
            const result = await Faculty.findById(req.params.id);
            await result.update({$set:{[req.query.q]:req.body}});
            return res.status(200).json("Faculty updated succesfully")
        }
        return res.status(401).json("Faculty not Updated");
    } catch (error) {
        console.log(error);
        res.status(400).json("Error: " + error);

    }
}

const updateFacultyPeronalDetails = async (req, res) => {
    try {
        if(req.user.login && req.user.isFaculty){
            let query = {};
            const {img,correspondence_address,education_qualification} = req.body
            if(img){
                query['img'] = img
            }
            if(correspondence_address){
                query['correspondence_address'] = correspondence_address
            }
            if(education_qualification){
                query['education_qualification'] = education_qualification
            }
            const result = await Faculty.findById(req.params.id);
            await result.update({$set:query});
            return res.status(200).json("Faculty updated succesfully")
        }
        return res.status(401).json("Faculty not Updated");
    } catch (error) {
        console.log(error);
        res.status(400).json("Error: " + error);

    }
}

module.exports = { getAllFaculty, getByDeptFaculty, getByIdFaculty, updateFaculty, deleteFaculty, addFaculty, updateFacultyPeronalDetails }
