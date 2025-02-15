import React from "react";
import { View, Text } from "react-native";
import ShadedStar from "@/assets/icons/ShadedStar.svg";
import UnshadedStar from "@/assets/icons/UnshadedStar.svg";
import { StyleSheet } from "react-native";


interface StarReviewProps {
   avgRating: number;
   numRatings: number;
   full?: boolean; // If true, show 5 stars, else show 1
}

interface StarProps {
    avgRating: number;
    full?: boolean;
}

export function StarReview({ avgRating, numRatings, full = true}: StarReviewProps) {
   return (
      <View style={styles.container}>
        <Text style={styles.text}>{avgRating.toFixed(1)}</Text>
         <Stars avgRating={avgRating} full={full} />
         <Text style={styles.text}>({numRatings})</Text>
      </View>
   );
}
export function Stars({ avgRating, full = true }: StarProps) {
   const stars = [];
   const maxStars = full ? 5 : 1;
   if (full) {
        for (let i = 0; i < maxStars; i++) {
            if (i < avgRating) {
                stars.push(
                    <ShadedStar key={i} style={styles.star} />
                );
            }
            else {
                stars.push(
                <UnshadedStar key={i} style={styles.star} />
             );
            }
        } 
    } else {
        stars.push(
            <UnshadedStar key={0} style={styles.star} />
      );
    }

   return (
      <View style={styles.starsContainer}>
         {stars}
      </View>
   );
}

const styles = StyleSheet.create({
    container: {
       flexDirection: "row",
       alignItems: "center",
       justifyContent: "flex-start",
       gap: 7,
    },
    text: {
        fontFamily: "Source Sans 3",
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 18,
        letterSpacing: 0,
        textAlign: "center",
        color: "#285852", // Darker text color for contrast
     },
    starsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
     },
    star: {
        width: 80,
        height: 12,
     },
 });
