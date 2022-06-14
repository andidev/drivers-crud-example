import './App.css';
import { useEffect, useState } from "react";

function App() {

    const [drivers, setDrivers] = useState([]);
    const [addDriverDialogState, setAddDriverDialogState] = useState({ open: false });
    const [changeDriverDialogState, setChangeDriverDialogState] = useState({ open: false, driver: undefined });

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        setDrivers(await loadDriversFromFirebase())
    }

    const handleAddDriver = async (driver) => {
        await createDriverInFirebase(driver)// store new driver in firebase
        setAddDriverDialogState({ open: false });
        await loadDrivers(); // reload data
    }

    const handleChangeDriver = async (driver) => {
        await updateDriverInFirebase(driver); // store changes to existing driver to firebase
        setChangeDriverDialogState({ open: false });
        await loadDrivers(); // reload data
    }

    const handleRemoveDriver = async (driver) => {
        await removeDriverInFirebase(driver); // store changes to existing driver to firebase
        await loadDrivers(); // reload data
    }

    return (
        <div className="App">
            <AddDriverDialog dialogState={addDriverDialogState} onAddDriver={handleAddDriver} onBack={() => setAddDriverDialogState({ open: false }) }/>
            <ChangeDriverDialog dialogState={changeDriverDialogState} onChangeDriver={handleChangeDriver} onBack={() => setChangeDriverDialogState({ open: false }) }/>
            <button onClick={() => setAddDriverDialogState({ open: true })}>Add Driver</button>
            <table>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                </tr>
                {drivers.map(driver => <DriverRow driver={driver}
                                            onClickAdd={(driver) => setChangeDriverDialogState({ open: true, driver })}
                                            onRemoveDriver={handleRemoveDriver}
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


function DriverRow({ driver, onClickAdd, onRemoveDriver }) {
    return (
        <tr>
            <td>{driver.id}</td>
            <td>{driver.name}</td>
            <td>
                <button onClick={() => onClickAdd(driver)}>edit</button>
            </td>
            <td>
                <button onClick={() => onRemoveDriver(driver)}>remove</button>
            </td>
        </tr>
    );
}

let driversInFirebase = [
    { id: 1, name: 'Jimi', },
    { id: 2, name: 'Morrisey', },
    { id: 3, name: 'Doe', },
];

async function loadDriversFromFirebase() {
    return Promise.resolve(driversInFirebase); // Promise resolve is to fake async call to firebase here
}

async function createDriverInFirebase(driver) {
    const nextId = driversInFirebase.length + 1;
    driversInFirebase.push({ id: nextId, name: driver.name });
    return Promise.resolve(); // Promise resolve is to fake async call to firebase here
}

async function updateDriverInFirebase(driver) {
    const driverInFirebase = driversInFirebase.find(_driver => _driver.id === driver.id)
    driverInFirebase.name = driver.name;
    return Promise.resolve(); // Promise resolve is to fake async call to firebase here
}

async function removeDriverInFirebase(driver) {
    driversInFirebase = driversInFirebase.filter(_driver => _driver.id !== driver.id)
    return Promise.resolve(); // Promise resolve is to fake async call to firebase here
}

export default App;
