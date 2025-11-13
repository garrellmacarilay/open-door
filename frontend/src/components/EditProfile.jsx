import { useEffect, useState} from 'react'
import api from '../utils/api'

export default function EditProfile({ isOpen, onClose }) {
    const [user, setUser] = useState({})
    const [fullName, setFullName] = useState('')
    const [profilePicture, setProfilePicture] = useState(null)
    const [preview, setPreview] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            const res = await api.get('/user')
            setUser(res.data.user)
            setFullName(res.data.user.full_name);
            setPreview(res.data.user.profile_picture_url || null);
        }
        fetchUser()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // reset message

        const formData = new FormData();
        formData.append('full_name', fullName);

        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }

        try {
            const res = await api.post('/user/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                setMessage('Profile updated successfully');
                setUser(res.data.user);

                // Update preview in case a new file was uploaded
                if (res.data.user.profile_picture_url) {
                    setPreview(res.data.user.profile_picture_url);
                }
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Laravel validation errors
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors)
                    .flat()
                    .join(' | '); // combine all messages
                console.error('Validation errors:', errors);
                setMessage(`Validation failed: ${errorMessages}`);
            } else {
                console.error('Profile update failed:', err);
                setMessage('Profile update failed. Please try again.');
            }
        }
    };


    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200
                ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            style={{ backdropFilter: isOpen ? 'blur(4px)' : 'none' }}
        >
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg z-10">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
                <form onSubmit={handleSubmit}  className="space-y-4">
                    <div>
                        <label className="block font-semibold">Full Name</label>
                        <input  
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold">Profile Picture</label>
                        {preview && (
                            <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover mb-2"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0]

                                if (file) {
                                    setProfilePicture(file);
                                    setPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 transition"
                    >
                        Cancel
                    </button> 
                </form>

            </div>
        </div>
    )
}