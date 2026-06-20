import { useState, useEffect } from 'react'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy, getDoc,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Form } from '../types'

export function useForms() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)

  const fetchForms = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, 'forms'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      setForms(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Form)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchForms() }, [])

  const getForm = async (id: string): Promise<Form | null> => {
    const snapshot = await getDoc(doc(db, 'forms', id))
    if (!snapshot.exists()) return null
    return { id: snapshot.id, ...snapshot.data() } as Form
  }

  const createForm = async (form: Omit<Form, 'id' | 'createdAt'>): Promise<string> => {
    const cleaned = JSON.parse(JSON.stringify(form))
    const docRef = await addDoc(collection(db, 'forms'), {
      ...cleaned,
      createdAt: serverTimestamp(),
    })
    await fetchForms()
    return docRef.id
  }

  const updateForm = async (id: string, updates: Partial<Omit<Form, 'id' | 'createdAt'>>): Promise<void> => {
    const cleaned = JSON.parse(JSON.stringify(updates))
    await updateDoc(doc(db, 'forms', id), cleaned)
    await fetchForms()
  }

  const deleteForm = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'forms', id))
    await fetchForms()
  }

  return { forms, loading, getForm, createForm, updateForm, deleteForm }
}
