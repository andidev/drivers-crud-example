import './App.css';
import { useEffect, useState } from "react";

let driversInFirebase = [
    { id: 1, name: 'Jimi', },
    { id: 2, name: 'Morrisey', },
    { id: 3, name: 'Doe', },
];

function createDriverInFirebase(driver) {
    const nextId = driversInFirebase.length + 1;
    driversInFirebase.push({ id: nextId, name: driver.name });
}

function updateDriverInFirebase(driver) {
    const driverInFirebase = driversInFirebase.find(_driver => _driver.id === driver.id)
    driverInFirebase.name = driver.name;
}

function removeDriverInFirebase(driver) {
    driversInFirebase = driversInFirebase.filter(_driver => _driver.id !== driver.id)
}

function App() {

    const [drivers, setDrivers] = useState([]);
    const [addDriverDialogState, setAddDriverDialogState] = useState({ open: false });
    const [changeDriverDialogState, setChangeDriverDialogState] = useState({ open: false, driver: undefined });

    useEffect(() => {
        loadDriversFromFirebase();
    }, []);

    const loadDriversFromFirebase = () => {
        setDrivers(driversInFirebase)
    }

    const handleAddDriver = (driver) => {
        createDriverInFirebase(driver)// store new driver in firebase
        setAddDriverDialogState({ open: false });
        loadDriversFromFirebase(); // reload data
    }

    const handleChangeDriver = (driver) => {
        updateDriverInFirebase(driver); // store changes to existing driver to firebase
        setChangeDriverDialogState({ open: false });
        loadDriversFromFirebase(); // reload data
    }

    const handleRemoveDriver = (driver) => {
        removeDriverInFirebase(driver); // store changes to existing driver to firebase
        loadDriversFromFirebase(); // reload data
    }

    return (
        <div className="App">
            <AddDriverDialog dialogState={addDriverDialogState} onAddDriver={handleAddDriver} onBack={() => setAddDriverDialogState({ open: false }) }/>
            <ChangeDriverDialog dialogState={changeDriverDialogState} onChangeDriver={handleChangeDriver} onBack={() => setChangeDriverDialogState({ open: false }) }/>
            <button onClick={(driver) => setAddDriverDialogState({ open: true })}>Add Driver</button>
            <table>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                </tr>
                {drivers.map(driver => <Row driver={driver}
                                            onClickEdit={(driver) => setChangeDriverDialogState({ open: true, driver })}
                                            onClickRemove={handleRemoveDriver}
                />)}
            </table>
        </div>
    );
}

function AddDriverDialog({ dialogState: { open }, onAddDriver, onBack }) {

    const [name, setName] = useState( '');

    if (!open) {
        return null;
    }

    const addDriver = () => {
        onAddDriver({ name });
        setName('');
    }

    return (
        <div className="App">
            <label>name</label>
            <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
            <br/>
            <button onClick={onBack}>Back</button>
            <button onClick={addDriver}>Add</button>
        </div>
    );
}

function ChangeDriverDialog({ dialogState: { open, driver }, onChangeDriver, onBack }) {

    const [name, setName] = useState('');

    useEffect(() => {
        if (open) {
            setName(driver.name);
        }
    }, [open]);

    if (!open) {
        return null;
    }

    const changeDriver = () => {
        onChangeDriver({ id: driver.id, name });
    }

    return (
        <div className="App">
            <label>id</label>
            <input type="text" name="id" disabled value={driver.id}/>
            <label>name</label>
            <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
            <br/>
            <button onClick={onBack}>Back</button>
            <button onClick={changeDriver}>Change</button>
        </div>
    );
}


function Row({ driver, onClickEdit, onClickRemove }) {
    return (
        <tr>
            <td>{driver.id}</td>
            <td>{driver.name}</td>
            <td>
                <button onClick={() => onClickEdit(driver)}>edit</button>
            </td>
            <td>
                <button onClick={() => onClickRemove(driver)}>remove</button>
            </td>
        </tr>
    );
}

export default App;
