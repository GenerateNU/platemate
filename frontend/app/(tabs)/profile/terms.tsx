import React, { useEffect } from "react";
import { ScrollView, Text, StyleSheet, View, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={[styles.scrollView, { paddingTop: insets.top + 64, backgroundColor: "white" }]}>
            <Text style={styles.title}>PLATEMATE TERMS</Text>
            <Text style={styles.lastUpdated}>Last Updated: April 9, 2025</Text>

            <Text style={styles.introText}>
                Welcome to PlateMate, the metric-based plate reviewing mobile application. These Terms of Service
                ("Terms") govern your access to and use of the PlateMate application, services, and website
                (collectively, the "Service"). Please read these Terms carefully before using PlateMate.
            </Text>

            <Text style={styles.introText}>
                By downloading, accessing, or using PlateMate, you agree to be bound by these Terms. If you do not agree
                to these Terms, please do not use the Service.
            </Text>

            <SectionHeader title="1. ACCEPTANCE OF TERMS" />
            <Text style={styles.paragraph}>
                1.1 By creating an account, downloading, accessing, or using the Service, you acknowledge that you have
                read, understood, and agree to be bound by these Terms, as well as our Privacy Policy.
            </Text>
            <Text style={styles.paragraph}>
                1.2 You must be at least 13 years of age to use the Service. If you are under 18, you represent that you
                have your parent's or legal guardian's permission to use the Service and that they have read and agree
                to these Terms.
            </Text>

            <SectionHeader title="2. ACCOUNT REGISTRATION" />
            <Text style={styles.paragraph}>
                2.1 To access certain features of PlateMate, you may need to register for an account. You agree to
                provide accurate, current, and complete information during the registration process.
            </Text>
            <Text style={styles.paragraph}>
                2.2 You are responsible for safeguarding your password and for all activities that occur under your
                account. You agree to notify PlateMate immediately of any unauthorized use of your account.
            </Text>
            <Text style={styles.paragraph}>
                2.3 PlateMate reserves the right to refuse service, terminate accounts, or remove content at its sole
                discretion.
            </Text>

            <SectionHeader title="3. USER CONTENT" />
            <Text style={styles.paragraph}>
                3.1 "User Content" refers to any content that users submit, post, or transmit to the Service, including
                reviews, ratings, photos, comments, and profile information.
            </Text>
            <Text style={styles.paragraph}>
                3.2 By submitting User Content to PlateMate, you grant PlateMate a worldwide, non-exclusive,
                royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative
                works of, display, and perform the User Content in connection with the Service.
            </Text>
            <Text style={styles.paragraph}>3.3 You represent and warrant that your User Content:</Text>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Is accurate and not misleading</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Does not violate any applicable laws or regulations</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Does not infringe or violate any third-party rights</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Does not contain any malicious code or content</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Complies with our Community Guidelines</Text>
            </View>
            <Text style={styles.paragraph}>
                3.4 PlateMate reserves the right, but has no obligation, to monitor, edit, or remove User Content that
                we determine, in our sole discretion, violates these Terms.
            </Text>

            <SectionHeader title="4. METRIC-BASED RATING SYSTEM" />
            <Text style={styles.paragraph}>
                4.1 PlateMate provides a metric-based system for food reviews. Users agree to provide honest, accurate
                ratings based on their genuine experiences.
            </Text>
            <Text style={styles.paragraph}>
                4.2 Manipulation of the rating system, including creating false reviews or engaging in review fraud, is
                strictly prohibited and may result in account termination.
            </Text>
            <Text style={styles.paragraph}>
                4.3 PlateMate reserves the right to modify the rating system, metrics, and algorithms at any time
                without prior notice.
            </Text>

            <SectionHeader title="5. PROHIBITED CONDUCT" />
            <Text style={styles.paragraph}>5.1 You agree not to:</Text>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Use the Service for any illegal purpose</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Post false, misleading, or deceptive reviews</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Harass, abuse, or harm other users</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Impersonate any person or entity</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Attempt to gain unauthorized access to the Service</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Use automated means to access or collect data from the Service</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Upload viruses or other malicious code</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Interfere with the proper functioning of the Service</Text>
            </View>
            <View style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>Attempt to reverse engineer any aspect of the Service</Text>
            </View>

            <SectionHeader title="6. INTELLECTUAL PROPERTY RIGHTS" />
            <Text style={styles.paragraph}>
                6.1 The Service and its original content (excluding User Content), features, and functionality are owned
                by PlateMate and are protected by copyright, trademark, and other intellectual property laws.
            </Text>
            <Text style={styles.paragraph}>
                6.2 The PlateMate name, logo, and all related names, logos, product and service names, designs, and
                slogans are trademarks of PlateMate or its affiliates. You must not use such marks without the prior
                written permission of PlateMate.
            </Text>

            <SectionHeader title="7. THIRD-PARTY LINKS AND CONTENT" />
            <Text style={styles.paragraph}>
                7.1 The Service may contain links to third-party websites or services that are not owned or controlled
                by PlateMate.
            </Text>
            <Text style={styles.paragraph}>
                7.2 PlateMate has no control over, and assumes no responsibility for, the content, privacy policies, or
                practices of any third-party websites or services. You acknowledge and agree that PlateMate shall not be
                responsible or liable for any damage or loss caused by use of any such third-party websites or services.
            </Text>

            <SectionHeader title="8. PRIVACY" />
            <Text style={styles.paragraph}>
                8.1 Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use,
                and disclose information about you.
            </Text>

            <SectionHeader title="9. TERMINATION" />
            <Text style={styles.paragraph}>
                9.1 PlateMate may terminate or suspend your access to the Service immediately, without prior notice or
                liability, for any reason, including if you breach these Terms.
            </Text>
            <Text style={styles.paragraph}>
                9.2 Upon termination, your right to use the Service will immediately cease. All provisions of these
                Terms which by their nature should survive termination shall survive termination.
            </Text>

            <SectionHeader title="10. DISCLAIMERS" />
            <Text style={styles.paragraph}>
                10.1 THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                OR IMPLIED.
            </Text>
            <Text style={styles.paragraph}>
                10.2 PLATEMATE DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE,
                OR THAT ANY CONTENT WILL BE ACCURATE OR RELIABLE.
            </Text>
            <Text style={styles.paragraph}>
                10.3 PLATEMATE DOES NOT ENDORSE, WARRANT, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED
                OR OFFERED BY A THIRD PARTY THROUGH THE SERVICE.
            </Text>

            <SectionHeader title="11. LIMITATION OF LIABILITY" />
            <Text style={styles.paragraph}>
                11.1 TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PLATEMATE BE LIABLE FOR ANY
                INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT
                LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF
                OR RELATING TO YOUR USE OF, OR INABILITY TO USE, THE SERVICE.
            </Text>
            <Text style={styles.paragraph}>
                11.2 IN NO EVENT WILL PLATEMATE'S TOTAL LIABILITY TO YOU FOR ALL DAMAGES EXCEED THE AMOUNT YOU HAVE PAID
                PLATEMATE IN THE LAST SIX (6) MONTHS, OR, IF GREATER, FIFTY DOLLARS ($50).
            </Text>

            <SectionHeader title="12. INDEMNIFICATION" />
            <Text style={styles.paragraph}>
                12.1 You agree to defend, indemnify, and hold harmless PlateMate and its employees, contractors,
                officers, directors, and agents from and against any and all claims, damages, obligations, losses,
                liabilities, costs, and expenses arising from your use of the Service or your violation of these Terms.
            </Text>

            <SectionHeader title="13. GOVERNING LAW" />
            <Text style={styles.paragraph}>
                13.1 These Terms shall be governed by the laws of [Your Jurisdiction], without regard to its conflict of
                law provisions.
            </Text>
            <Text style={styles.paragraph}>
                13.2 Any legal action or proceeding relating to your access to or use of the Service shall be instituted
                in the courts of [Your Jurisdiction]. You and PlateMate agree to submit to the personal jurisdiction of
                such courts.
            </Text>

            <SectionHeader title="14. DISPUTE RESOLUTION" />
            <Text style={styles.paragraph}>
                14.1 Any dispute arising from these Terms shall first be attempted to be resolved through informal
                negotiations.
            </Text>
            <Text style={styles.paragraph}>
                14.2 If informal negotiations fail, any dispute shall be resolved through binding arbitration
                administered by [Arbitration Organization] in accordance with its rules.
            </Text>
            <Text style={styles.paragraph}>
                14.3 YOU UNDERSTAND THAT BY AGREEING TO THESE TERMS, YOU ARE WAIVING YOUR RIGHT TO A TRIAL BY JURY OR TO
                PARTICIPATE IN A CLASS ACTION LAWSUIT.
            </Text>

            <SectionHeader title="15. CHANGES TO TERMS" />
            <Text style={styles.paragraph}>
                15.1 PlateMate reserves the right to modify or replace these Terms at any time. We will provide notice
                of any material changes through the Service or by other means.
            </Text>
            <Text style={styles.paragraph}>
                15.2 Your continued use of the Service after any such changes constitutes your acceptance of the new
                Terms.
            </Text>

            <SectionHeader title="16. GENERAL PROVISIONS" />
            <Text style={styles.paragraph}>
                16.1 If any provision of these Terms is held to be invalid or unenforceable, such provision shall be
                struck and the remaining provisions shall be enforced.
            </Text>
            <Text style={styles.paragraph}>
                16.2 Our failure to enforce any right or provision of these Terms will not be considered a waiver of
                those rights.
            </Text>
            <Text style={styles.paragraph}>
                16.3 These Terms constitute the entire agreement between you and PlateMate regarding the Service and
                supersede all prior agreements.
            </Text>

            <SectionHeader title="17. CONTACT INFORMATION" />
            <Text style={styles.paragraph}>
                17.1 If you have any questions about these Terms, please contact us at:
            </Text>
            <Text style={styles.contactInfo}>
                PlateMate, Inc.{"\n"}
                [Your Address]{"\n"}
                [Your City, State, ZIP]{"\n"}
                [Your Country]{"\n"}
                Email: support@platemate.com
            </Text>
        </ScrollView>
    );
}

const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeader}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        fontFamily: "Nunito",
    },
    lastUpdated: {
        fontSize: 14,
        color: "#666",
        marginBottom: 24,
        textAlign: "center",
        fontFamily: "Nunito",
    },
    introText: {
        fontSize: 16,
        marginBottom: 16,
        lineHeight: 20,
        fontFamily: "Nunito",
    },
    sectionHeaderContainer: {
        marginTop: 12,
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Nunito",
    },
    paragraph: {
        fontSize: 15,
        marginBottom: 12,
        lineHeight: 20,
        fontFamily: "Nunito",
    },
    bulletPoint: {
        fontSize: 15,
        marginBottom: 8,
        lineHeight: 20,
        paddingLeft: 8,
        fontFamily: "Nunito",
    },
    bulletItem: {
        flexDirection: "row",
        marginBottom: 8,
        paddingLeft: 8,
        alignItems: "flex-start",
    },
    bullet: {
        fontSize: 15,
        lineHeight: 20,
        marginRight: 8,
        width: 10,
        textAlign: "center",
        fontFamily: "Nunito",
    },
    bulletText: {
        fontSize: 15,
        lineHeight: 20,
        flex: 1,
        fontFamily: "Nunito",
    },
    contactInfo: {
        fontSize: 15,
        marginTop: 8,
        lineHeight: 20,
        fontFamily: "Nunito",
    },
});
