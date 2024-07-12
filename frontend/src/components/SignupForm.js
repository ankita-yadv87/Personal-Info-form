import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        address: '',
        sameAsResidential: false,
        permanentaddress: '',
        documents: [{ fileName: '', fileType: '', file: null }]
    });

    const [message, setMessage] = useState('');
    const [candidate, setCandidate] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleDocumentChange = (index, e) => {
        const { name, value, files } = e.target;
        const newDocuments = [...formData.documents];
        newDocuments[index] = {
            ...newDocuments[index],
            [name]: name === 'file' ? files[0] : value
        };
        setFormData({
            ...formData,
            documents: newDocuments
        });
    };

    const addDocumentField = () => {
        setFormData({
            ...formData,
            documents: [...formData.documents, { fileName: '', fileType: '', file: null }]
        });
    };

    const removeDocumentField = (index) => {
        const newDocuments = formData.documents.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            documents: newDocuments
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        for (let key in formData) {
            if (key === 'documents') {
                formData.documents.forEach((doc, index) => {
                    form.append(`documents[${index}].file`, doc.file);
                    form.append(`documents[${index}].fileName`, doc.fileName);
                    form.append(`documents[${index}].fileType`, doc.fileType);
                });
            } else if (key === 'sameAsResidential') {
                form.append(key, formData[key]);
            } else if (key === 'permanentaddress') {
                if (!formData.sameAsResidential) {
                    form.append('permanentAddress', formData[key]);
                }
            } else {
                form.append(key, formData[key]);
            }
        }

        try {
            const response = await axios.post('http://localhost:5000/api/v1/signup', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Signup successful!');
            window.alert('Signup successful!');
            setCandidate(response.data.candidate);
        } catch (error) {
            setMessage('Signup failed. ' + error.response.data.message);
            window.alert('Signup failed. ' + error.response.data.message);
        }
    };

    return (
        <div className="signup-form">
            <h2>Signup Form</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    First Name:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </label>
                <label>
                    Last Name:
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </label>
                <label>
                    Date of Birth:
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                </label>
                <label>
                    Residential Address:
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                </label>
                <label>
                    Same as Residential:
                    <input type="checkbox" name="sameAsResidential" checked={formData.sameAsResidential} onChange={handleInputChange} />
                </label>
                {!formData.sameAsResidential && (
                    <label>
                        Permanent Address:
                        <input type="text" name="permanentaddress" value={formData.permanentaddress} onChange={handleInputChange} required />
                    </label>
                )}
                <h3>Upload Documents</h3>
                {formData.documents.map((doc, index) => (
                    <div key={index} className="document-fields">
                        {/* <label>
                            File Name:
                            <input type="text" name="fileName" value={doc.fileName} onChange={(e) => handleDocumentChange(index, e)} required />
                        </label>
                        <label>
                            Type of File:
                            <select name="fileType" value={doc.fileType} onChange={(e) => handleDocumentChange(index, e)} required>
                                <option value="">Select file type</option>
                                <option value="jpg">Image</option>
                                <option value="pdf">PDF</option>
                            </select>
                        </label> */}
                        <label>
                            Upload Document:
                            <input type="file" name="file" onChange={(e) => handleDocumentChange(index, e)} required />
                        </label>
                        <button type="button" onClick={() => removeDocumentField(index)} className="delete-button">Delete</button>
                    </div>
                ))}
                <button type="button" onClick={addDocumentField} className="add-button">Add Document</button>
                <button type="submit">Signup</button>
            </form>
            {candidate && (
                <div className="candidate-details">
                    <h3>Candidate Details</h3>
                    <p>First Name: {candidate.firstName}</p>
                    <p>Last Name: {candidate.lastName}</p>
                    <p>Email: {candidate.email}</p>
                    <p>Date of Birth: {new Date(candidate.dateOfBirth).toLocaleDateString()}</p>
                    <p>Residential Address: {candidate.address.address}</p>
                    <p>Same as Residential: {candidate.sameAsResidential ? 'Yes' : 'No'}</p>
                    {!candidate.sameAsResidential && (
                        <p>Permanent Address: {candidate.permanentAddress.address}</p>
                    )}
                    <h4>Documents:</h4>
                    <ul>
                        {candidate.documents.map(doc => (
                            <li key={doc._id}>
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">{doc.fileName}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SignupForm;
