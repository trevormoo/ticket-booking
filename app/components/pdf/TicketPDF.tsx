// components/pdf/TicketPDF.tsx
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// Define PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  section: {
    marginBottom: 10
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  label: {
    fontWeight: 'bold'
  },
  qr: {
    marginTop: 20,
    width: 120,
    height: 120
  }
})

type Props = {
  ticket: {
    name: string
    email: string
    event: {
      title: string
      date: string
    }
    id: number
    createdAt: string
    qrUrl?: string // hosted QR image (e.g. Cloudinary)
  }
}

export function TicketPDF({ ticket }: { ticket: Props['ticket'] }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Event Ticket</Text>
        </View>

        <View style={styles.section}>
          <Text><Text style={styles.label}>Name:</Text> {ticket.name}</Text>
          <Text><Text style={styles.label}>Email:</Text> {ticket.email}</Text>
          <Text><Text style={styles.label}>Event:</Text> {ticket.event.title}</Text>
          <Text><Text style={styles.label}>Date:</Text> {new Date(ticket.event.date).toLocaleDateString()}</Text>
          <Text><Text style={styles.label}>Booking ID:</Text> {ticket.id}</Text>
          <Text><Text style={styles.label}>Booked at:</Text> {new Date(ticket.createdAt).toLocaleString()}</Text>
        </View>

        {ticket.qrUrl && (
          <View style={styles.section}>
            <Text>Scan this at the entrance:</Text>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={ticket.qrUrl} style={styles.qr} />
          </View>
        )}
      </Page>
    </Document>
  )
}