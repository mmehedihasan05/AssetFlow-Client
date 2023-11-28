import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

const Print = () => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <div className="flex flex-col justify-between">
                    <View style={styles.section}>
                        <Text>FRESH</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>26 November 2023</Text>
                    </View>
                </div>
            </Page>
        </Document>
    );
};

export default Print;
