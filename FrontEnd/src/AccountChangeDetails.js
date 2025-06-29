import React, {useState, useEffect} from 'react'
import UpdateMeetUpPlace from './UpdateMeetUpPlace';
import UpdateSelectedLocation from './UpdateSelectedLocation';
import UpdateCellphoneNumber from './UpdateCellphoneNumber'
import UpdatePassword from './UpdatePassword';

function AccountChangeDetails() {
    const handleShowUpdateCellphoneNumber = () => setShowUpdateCellphoneNumber(true);
    const handleCloseUpdateCellphoneNumber = () => setShowUpdateCellphoneNumber(false);
    const [accountData, setAccountData] = useState(null);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);
    const [showUpdateMeetUpPlace, setShowUpdateMeetUpPlace] = useState(false);
    const [showUpdateSelectedLocation, setShowUpdateSelectedLocation] = useState(false);
    const [showUpdateCellphoneNumber, setShowUpdateCellphoneNumber] = useState(false);
    const email = window.localStorage.getItem('email')
    const handleShowUpdateSelectedLocation = () => setShowUpdateSelectedLocation(true);
const handleCloseUpdateSelectedLocation = () => setShowUpdateSelectedLocation(false);

    const handleShowUpdatePassword = () => setShowUpdatePassword(true);
    const handleCloseUpdatePassword = () => setShowUpdatePassword(false);
    const handleShowUpdateMeetUpPlace = () => setShowUpdateMeetUpPlace(true);
  const handleCloseUpdateMeetUpPlace = () => setShowUpdateMeetUpPlace(false);
    const handleUpdateCellphoneNumberClick = () => {
        handleShowUpdateCellphoneNumber();


      };

      useEffect(() => {
        fetchAccountData();
    }, []);
    const fetchAccountData = async () => {
        try {
          const response = await fetch(`http://localhost:8081/getDataAccount?email=${email}`);
          const data = await response.json();
          setAccountData(data.account);
        } catch (error) {
          console.error('Error fetching account data:', error);
        }
      };
    return (

        <div>
            <div>
                <h1>Account Details</h1>
                <br></br>
            </div>
            {accountData ? (
                <div>
                    <h1>First Name</h1>
                    <p>{accountData.firstname}</p>
                    <h1>Last Name</h1>
                    <p>{accountData.lastname}</p>
                    <h1>Email</h1>
                    <p>{accountData.email}</p>
                    <h1>Password</h1>
                    <p>*************</p>
                    <button variant="primary" onClick={handleShowUpdatePassword}>
                        Update Password
                    </button>

                    <UpdatePassword show={showUpdatePassword} onClose={handleCloseUpdatePassword} email={email} />
                    <h1>MeetUpPlace</h1>
                    <p>{accountData.meetUpPlace}</p>
                    <button onClick={handleShowUpdateMeetUpPlace}>Update MeetUpPlace</button>
                    <UpdateMeetUpPlace show={showUpdateMeetUpPlace} onClose={handleCloseUpdateMeetUpPlace} email={email} />
                    <h1>Selected Location</h1>
                    <p>{accountData.selectedLocation}</p>
                    <button onClick={handleShowUpdateSelectedLocation}>Update Selected Location</button>

                    <UpdateSelectedLocation
                        show={showUpdateSelectedLocation}
                        onClose={handleCloseUpdateSelectedLocation}
                        email={email}
                    />
                    <h1>CellPhone Number</h1>
                    <p>{accountData.cellphoneNumber}</p>
                    <button variant="primary" onClick={handleUpdateCellphoneNumberClick}>
                        Update Cellphone Number
                    </button>
                    <UpdateCellphoneNumber
                        show={showUpdateCellphoneNumber}
                        onClose={handleCloseUpdateCellphoneNumber}
                        email={email}
                    />

                    <div>

                    </div>
                </div>
            ) : (
                <p>Loading account details...</p>
            )}
        </div>
    )

}

export default AccountChangeDetails