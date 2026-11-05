import moment from "moment"
import "moment/min/locales.min"
import axios from "axios"
const cloudSecret = process.env.REACT_APP_CLOUD_SECRET2
const cloudName = process.env.REACT_APP_CLOUD_NAME

export const GetReceiver = (userId, members) => {
    if(userId === members[0]._id) return members[1]._id 
    else return members[0]._id 
}

export const useValidateName = (data) => {
    const {name, email, password} = data 
    const result = /^[a-zA-Z ]+$/.test(name)
    if(!name) return ''
    if(!result) return 'Please write a valid name and no special characters are allowed.'
    else return ''
}

export const MomentDate = (date) => {
    let now = moment()
    let momentDate = moment(date)
    let time = momentDate.fromNow(true)
    let dateByHourAndMin = momentDate.format('hh:mm a')
    if(time === 'a few seconds') return 'Now'
    if(time.search('minute') !== -1){
        let mins = time.split(' ')[0]
        if(mins === 'a') return '1 min'
        else return `${mins} mins`
    }
    if(time === 'a day') return 'yesterday'
    if(time.search('hour' !== -1)){
        return dateByHourAndMin
    }
    if(time.search('days' !== -1)){
        let days = time.split(' ')[0]
        if(Number(days) < 8){
            return now.subtract(Number(days), 'days').format('dddd')
        }
        else{
            return momentDate.format('DD/MM/YYYY')
        }
    }
    //   1 am - 11 am      1 pm - 11 pm
    //  12 am - 11 am     12 pm - 11 pm
}

export const uploadFiles = async(files) =>{
    let formData = new FormData()
    formData.append('upload_preset', cloudSecret)
    let uploaded = []
    for(const f of files) {
        const {file, type} = f;
        formData.append('file', file)
        let res = await uploadToCloudinary(formData, type)
        uploaded.push({
            file:res,
            type:type
        })
    }
    console.log(uploaded)
    return uploaded
}

const uploadToCloudinary = async(formData, type) =>{
    return new Promise(async(resolve)=>{
        const cloudinaryURL = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`
        return await axios.post(cloudinaryURL, formData)
        .then(({data})=>{
            resolve(data)
        })
        .catch((err)=>{
            console.log(err.response.data.error.message)
            alert('file size too large!')
        })
    })
}

export const capitalize = (word) =>{
    return word[0].toUpperCase() + word.substring(1).toLowerCase()
}

export const getConversationName = (user, members) =>{
    return members[0]._id === user.id ? members[1].name : members[0].name
}

export const getConversationPicture = (user, members) =>{
    return members[0]._id === user.id ? members[1].picture : members[0].picture
}

export const getConversationId = (user, members) =>{
    return members[0]._id === user.id ? members[1]._id : members[0]._id
}