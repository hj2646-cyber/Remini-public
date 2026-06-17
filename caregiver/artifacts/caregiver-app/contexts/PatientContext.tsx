import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const SELECTED_PATIENT_KEY = "selected_patient_id";

type PatientContextType = {
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
};

const PatientContext = createContext<PatientContextType>({
  selectedPatientId: null,
  setSelectedPatientId: () => {},
});

export function PatientProvider({ children }: { children: ReactNode }) {
  const [selectedPatientId, setSelectedPatientIdState] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(SELECTED_PATIENT_KEY).then((val) => {
      if (val) setSelectedPatientIdState(val);
    });
  }, []);

  const setSelectedPatientId = (id: string | null) => {
    setSelectedPatientIdState(id);
    if (id !== null) {
      AsyncStorage.setItem(SELECTED_PATIENT_KEY, id);
    } else {
      AsyncStorage.removeItem(SELECTED_PATIENT_KEY);
    }
  };

  return (
    <PatientContext.Provider value={{ selectedPatientId, setSelectedPatientId }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  return useContext(PatientContext);
}
