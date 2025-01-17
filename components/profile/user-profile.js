// import {getSession} from 'next-auth/react';
// import {useEffect, useState} from 'react';

import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile() {
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Redirect away if NOT auth
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  async function updatePassword(passwordData) {
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    console.log({data});
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={updatePassword} />
    </section>
  );
}

export default UserProfile;
