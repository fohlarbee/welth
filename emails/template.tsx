import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import { format } from "date-fns";
import * as React from "react";

interface LoanApplication {
  netIncome: number | string;
  creditScore: number;
  repaymentPlan: string;
  decisionNote: string;
  recommendedLoanAmount: number | string;
  loanTenure: number;
  evaluatedAt: string | Date;
}

export default function EmailTemplate({
  userName = "",
  type,
  data
}: {
  userName?: string;
  type?: string;
  data: LoanApplication;
}) {
     function formatNumberWithCommas(value: number | string): string {
      const number = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(number)) return "0";
      return number.toLocaleString("en-NG", {
        style:'currency',
        currency:'NGN'
      });
   }
   if (type === 'loanRecommendation-report' ){

       return (
         <Html>
             <Head/>
             <Preview>Your Loan Recommendation Report</Preview>
             <Body style={styles.body}>
                 <Container style={styles.container}>
                    <Heading style={styles.title}>Loan Recommendation Review</Heading>
                    <Text style={styles.heading}>Hello {userName},</Text>
                    <Text style={styles.text}>Here&apos;s your Loan Recommendation Review</Text>
                    <Section style={styles.statsContainer}>
                         <div style={styles.stat}>
                             <Text style={styles.text}>Net Income</Text>
                             <Text style={styles.heading}>{formatNumberWithCommas (data.netIncome)}</Text>
                         </div>
                         <div style={styles.stat}>
                             <Text style={styles.text}>Credit Score</Text>
                             <Text style={{ ...styles.heading, color: data.creditScore <= 49 ? 'red' : 'green' }}>{(data.creditScore)}%</Text>
                         </div>
                         <div style={styles.stat}>
                             <Text style={styles.heading}>Repayment Plan</Text>
                             <Text style={styles.text}>{data.repaymentPlan}</Text>
                         </div>
                         <div style={styles.stat}>
                             <Text style={styles.heading}>Decision Note</Text>
                             <Text style={styles.text}>{data.decisionNote}</Text>
                         </div>
                         <div style={styles.stat}>
                             <Button style={styles.button}>Recommended Loan Amount: {formatNumberWithCommas( data.recommendedLoanAmount)}</Button>
                         </div>
                          <div style={styles.stat}>
                             <Button style={styles.button2}>Loan Tenure: {data.loanTenure}  {data.loanTenure > 1 ? 'Months' : 'Month'}</Button>
                         </div>
                             <div style={styles.stat}>
                             <Text style={styles.text}>EvaluatedAt</Text>
                             <Text style={styles.heading}>{format(new Date(data.evaluatedAt), 'PP') }</Text>
                         </div>
                    </Section>
                     
                 </Container>
             </Body>
         </Html>
       );
   }
}




const styles = {
    body: {
        backgroundColor: "#f6f9fc",
        fontFamily: "-apple-system, sans-serif",
    },
    container: {
        backgroundColor: "#ffffff",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    title: {
        color: "#1f2937",
        fontSize: "32px",
        fontWeight: "bold",
        textAlign: "center" as const,
        margin: "0 0 20px",
    },
    heading: {
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "600",
        margin: "0 0 16px",
    },
    text: {
        color: "#4b5563",
        fontSize: "16px",
        margin: "0 0 16px",
    },
    section: {
        marginTop: "32px",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "5px",
        border: "1px solid #e5e7eb",
    },
    statsContainer: {
        margin: "32px 0",
        padding: "20px",
        backgroundColor: "#f9fafb",
        borderRadius: "5px",
    },
    stat: {
        marginBottom: "16px",
        padding: "12px",
        backgroundColor: "#fff",
        borderRadius: "4px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #e5e7eb",
    },
    footer: {
        color: "#6b7280",
        fontSize: "14px",
        textAlign: "center",
        marginTop: "32px",
        paddingTop: "16px",
        borderTop: "1px solid #e5e7eb",
    },
    button: {
        padding: "10px",
        backgroundColor: '#63C8FF',
        borderRadius: '10px',
        color: '#fff',
        fontWeight: '600',
        cursor: 'pointer'
    },
    button2: {
        padding: "10px",
        backgroundColor: '#eee',
        borderRadius: '10px',
        color: '#000',
        fontWeight: '300',
        cursor: 'pointer'
    }
};