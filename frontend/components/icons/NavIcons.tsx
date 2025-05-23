import Svg, { Path } from "react-native-svg";

export const HomeNavIcon = ({ width = 20, height = 18, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 20 18" fill="none" {...props}>
            <Path
                d="M7.99778 16.3276V11.3276H11.9978V16.3276C11.9978 16.8776 12.4478 17.3276 12.9978 17.3276H15.9978C16.5478 17.3276 16.9978 16.8776 16.9978 16.3276V9.32761H18.6978C19.1578 9.32761 19.3778 8.75761 19.0278 8.45761L10.6678 0.927607C10.2878 0.587607 9.70778 0.587607 9.32778 0.927607L0.967779 8.45761C0.627779 8.75761 0.837779 9.32761 1.29778 9.32761H2.99778V16.3276C2.99778 16.8776 3.44778 17.3276 3.99778 17.3276H6.99778C7.54778 17.3276 7.99778 16.8776 7.99778 16.3276Z"
                fill={color}
            />
        </Svg>
    );
};

export const MapNavIcon = ({ width = 24, height = 24, color = "black", strokeWidth = 2.5, ...props }) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            {...props}>
            <Path d="M15 11a3 3 0 1 0 -3.973 2.839" />
            <Path d="M11.76 21.47a1.991 1.991 0 0 1 -1.173 -.57l-4.244 -4.243a8 8 0 1 1 13.657 -5.588" />
            <Path d="M18 22l3.35 -3.284a2.143 2.143 0 0 0 .005 -3.071a2.242 2.242 0 0 0 -3.129 -.006l-.224 .22l-.223 -.22a2.242 2.242 0 0 0 -3.128 -.006a2.143 2.143 0 0 0 -.006 3.071l3.355 3.296z" />
        </Svg>
    );
};

export const ProfileNavIcon = ({ width = 16, height = 16, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 16 16" fill="none" {...props}>
            <Path
                d="M14.39 10.56C12.71 9.7 10.53 9 8 9C5.47 9 3.29 9.7 1.61 10.56C0.61 11.07 0 12.1 0 13.22V16H16V13.22C16 12.1 15.39 11.07 14.39 10.56ZM14 14H2V13.22C2 12.84 2.2 12.5 2.52 12.34C3.71 11.73 5.63 11 8 11C10.37 11 12.29 11.73 13.48 12.34C13.8 12.5 14 12.84 14 13.22V14Z"
                fill={color}
            />
            <Path
                d="M5.78 8H10.22C11.43 8 12.36 6.94 12.2 5.74L11.88 3.29C11.57 1.39 9.92 0 8 0C6.08 0 4.43 1.39 4.12 3.29L3.8 5.74C3.64 6.94 4.57 8 5.78 8ZM6.1 3.59C6.26 2.67 7.06 2 8 2C8.94 2 9.74 2.67 9.9 3.59L10.22 6H5.78L6.1 3.59Z"
                fill={color}
            />
        </Svg>
    );
};

export const SearchNavIcon = ({ width = 19, height = 18, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 19 18" fill="none" {...props}>
            <Path
                d="M7 13C5.18333 13 3.64583 12.3708 2.3875 11.1125C1.12917 9.85417 0.5 8.31667 0.5 6.5C0.5 4.68333 1.12917 3.14583 2.3875 1.8875C3.64583 0.629167 5.18333 0 7 0C8.81667 0 10.3542 0.629167 11.6125 1.8875C12.8708 3.14583 13.5 4.68333 13.5 6.5C13.5 7.23333 13.3833 7.925 13.15 8.575C12.9167 9.225 12.6 9.8 12.2 10.3L17.8 15.9C17.9833 16.0833 18.075 16.3167 18.075 16.6C18.075 16.8833 17.9833 17.1167 17.8 17.3C17.6167 17.4833 17.3833 17.575 17.1 17.575C16.8167 17.575 16.5833 17.4833 16.4 17.3L10.8 11.7C10.3 12.1 9.725 12.4167 9.075 12.65C8.425 12.8833 7.73333 13 7 13ZM7 11C8.25 11 9.3125 10.5625 10.1875 9.6875C11.0625 8.8125 11.5 7.75 11.5 6.5C11.5 5.25 11.0625 4.1875 10.1875 3.3125C9.3125 2.4375 8.25 2 7 2C5.75 2 4.6875 2.4375 3.8125 3.3125C2.9375 4.1875 2.5 5.25 2.5 6.5C2.5 7.75 2.9375 8.8125 3.8125 9.6875C4.6875 10.5625 5.75 11 7 11Z"
                fill={color}
            />
        </Svg>
    );
};

// Add this to your NavIcons.tsx file in the components/icons directory

export const RestaurantNavIcon = ({ color = "#000", width = 24, height = 24 }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M21 9L21 11C21 14.3137 18.3137 17 15 17H9C5.68629 17 3 14.3137 3 11L3 9"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15 17V19C15 20.1046 14.1046 21 13 21H11C9.89543 21 9 20.1046 9 19V17"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path d="M12 17V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path
                d="M19 9V7C19 4.79086 17.2091 3 15 3H9C6.79086 3 5 4.79086 5 7V9"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path d="M8 13H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8 9H16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};

export const RestaurantAnalyticsNavIcon = ({ width = 24, height = 24, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
            {/* Bar chart icon */}
            <Path d="M3 3V21H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M7 16V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M11 16V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M15 16V8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M19 16V6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};
