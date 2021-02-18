import { useState, useCallback, useEffect } from 'react'
import { GoogleSpreadsheet } from "google-spreadsheet"


export const useSheet = () => {
    const [doc, setDoc] = useState(null)
    const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID
    const SHEET_ID = process.env.REACT_APP_SHEET_ID
    const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL
    const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n')

    useEffect(() => {
        const newDoc = new GoogleSpreadsheet(SPREADSHEET_ID)
        setDoc(newDoc)
    }, [SPREADSHEET_ID])

    const appendSpreadsheet = useCallback(async (row) => {
        try {
            await doc.useServiceAccountAuth({
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            })
            await doc.loadInfo()

            const sheet = doc.sheetsById[SHEET_ID];
            await sheet.addRow(row)
        } catch (e) {
            console.error('Error: ', e)
        }
    }, [CLIENT_EMAIL, PRIVATE_KEY, SHEET_ID, doc])

    return { appendSpreadsheet }
}