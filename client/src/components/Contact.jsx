import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandlord();
  }, [listing.userRef]);

  const generateMailtoLink = () => {
    const subject = `Regarding ${listing.name}`;
    const body = encodeURIComponent(message); // Encode message to handle special characters
    return `mailto:${landlord.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  return (
    <>
      {landlord && (
        <div className='text-lg mt-4 flex flex-col gap-2'>
          <p>
            Contact: <span className='font-semibold'>{landlord.username}</span> for{' '}
            <span>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className='w-full border p-3 rounded-lg'
            placeholder='Enter your message'
            name='message'
            id='message'
            value={message}
            onChange={onChange}
            rows='2'
          ></textarea>
          <a
            href={generateMailtoLink()}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message
          </a>
        </div>
      )}
    </>
  );
};

export default Contact;
