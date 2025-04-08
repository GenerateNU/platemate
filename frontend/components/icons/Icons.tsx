import React from "react";
import Svg, { Path } from "react-native-svg";
import { View } from "react-native";

export const PhoneIcon = ({ width = 18, height = 18, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 18 18" fill="none" {...props}>
            <Path
                d="M18 13.42V16.956C18.0001 17.2092 17.9042 17.453 17.7316 17.6382C17.559 17.8234 17.3226 17.9363 17.07 17.954C16.6333 17.9847 16.2767 18 16 18C7.163 18 0 10.837 0 2C0 1.724 0.0153333 1.36733 0.046 0.93C0.0637224 0.677444 0.176581 0.441011 0.361804 0.268409C0.547026 0.0958068 0.790823 -0.000114433 1.044 2.56579e-07H4.58C4.70404 -0.000125334 4.8237 0.045859 4.91573 0.12902C5.00776 0.212182 5.0656 0.326583 5.078 0.45C5.10067 0.679334 5.122 0.863333 5.142 1.002C5.34072 2.38893 5.74799 3.73784 6.35 5.003C6.445 5.203 6.383 5.442 6.203 5.57L4.045 7.112C5.36471 10.1863 7.81472 12.6363 10.889 13.956L12.429 11.802C12.4917 11.7137 12.5835 11.6503 12.6883 11.6231C12.7932 11.5958 12.9042 11.6064 13.002 11.653C14.267 12.2539 15.6156 12.6601 17.002 12.858C17.1407 12.878 17.324 12.8993 17.552 12.922C17.6752 12.9346 17.7894 12.9926 17.8724 13.0846C17.9553 13.1766 18.0002 13.2961 18 13.42Z"
                fill={color}
            />
        </Svg>
    );
};

export const WebsiteIcon = ({ width = 20, height = 20, color = "black", strokeWidth = 2, ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" {...props}>
            <Path
                d="M1.60098 7H18.401M1.60098 13H18.401M1.00098 10C1.00098 11.1819 1.23377 12.3522 1.68606 13.4442C2.13835 14.5361 2.80129 15.5282 3.63702 16.364C4.47274 17.1997 5.4649 17.8626 6.55683 18.3149C7.64876 18.7672 8.81908 19 10.001 19C11.1829 19 12.3532 18.7672 13.4451 18.3149C14.5371 17.8626 15.5292 17.1997 16.3649 16.364C17.2007 15.5282 17.8636 14.5361 18.3159 13.4442C18.7682 12.3522 19.001 11.1819 19.001 10C19.001 7.61305 18.0528 5.32387 16.3649 3.63604C14.6771 1.94821 12.3879 1 10.001 1C7.61403 1 5.32484 1.94821 3.63702 3.63604C1.94919 5.32387 1.00098 7.61305 1.00098 10Z"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9.50101 1C7.81635 3.69961 6.92322 6.81787 6.92322 10C6.92322 13.1821 7.81635 16.3004 9.50101 19M10.501 1C12.1857 3.69961 13.0788 6.81787 13.0788 10C13.0788 13.1821 12.1857 16.3004 10.501 19"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export const MarkerIcon = ({ width = 20, height = 20, color = "#fc0", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" {...props}>
            <Path
                d="M10 1.6665C6.50004 1.6665 3.33337 4.34984 3.33337 8.49984C3.33337 11.2665 5.55837 14.5415 10 18.3332C14.4417 14.5415 16.6667 11.2665 16.6667 8.49984C16.6667 4.34984 13.5 1.6665 10 1.6665ZM10 9.99984C9.08337 9.99984 8.33337 9.24984 8.33337 8.33317C8.33337 7.4165 9.08337 6.6665 10 6.6665C10.9167 6.6665 11.6667 7.4165 11.6667 8.33317C11.6667 9.24984 10.9167 9.99984 10 9.99984Z"
                fill={color}
            />
        </Svg>
    );
};

export const ClockIcon = ({ width = 20, height = 20, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 18 18" fill="none" {...props}>
            <Path
                d="M8.99996 0.666504C4.41663 0.666504 0.666626 4.4165 0.666626 8.99984C0.666626 13.5832 4.41663 17.3332 8.99996 17.3332C13.5833 17.3332 17.3333 13.5832 17.3333 8.99984C17.3333 4.4165 13.5833 0.666504 8.99996 0.666504ZM8.99996 15.6665C5.32496 15.6665 2.33329 12.6748 2.33329 8.99984C2.33329 5.32484 5.32496 2.33317 8.99996 2.33317C12.675 2.33317 15.6666 5.32484 15.6666 8.99984C15.6666 12.6748 12.675 15.6665 8.99996 15.6665ZM9.41663 4.83317H8.16663V9.83317L12.5 12.4998L13.1666 11.4165L9.41663 9.1665V4.83317Z"
                fill={color}
            />
        </Svg>
    );
};

export const BackChevron = ({ width = 12, height = 20, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 12 20" fill="none" {...props}>
            <Path
                d="M11.835 1.86998L10.055 0.0999756L0.165039 9.99998L10.065 19.9L11.835 18.13L3.70504 9.99998L11.835 1.86998Z"
                fill={color}
            />
        </Svg>
    );
};

export const TrendingIcon = ({ width = 74, height = 18, ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 74 18" fill="none" {...props}>
            <Path
                d="M0 0.000300481H74L63.7196 8.84872C63.6269 8.92851 63.6269 9.07209 63.7196 9.15188L74 18.0003H0V0.000300481Z"
                fill="#FFCF0F"
            />
            <Path
                d="M10.8232 13V6.74512H8.55273V5.9541H13.9727V6.74512H11.7021V13H10.8232ZM14.5502 13V7.73633H15.3998V8.51758H15.478C15.5789 8.24089 15.7498 8.02604 15.9907 7.87305C16.2315 7.72005 16.5294 7.64355 16.8842 7.64355C16.9656 7.64355 17.0454 7.64844 17.1235 7.6582C17.2049 7.66471 17.2667 7.67122 17.309 7.67773V8.50293C17.2211 8.48665 17.1349 8.47526 17.0502 8.46875C16.9689 8.45898 16.881 8.4541 16.7866 8.4541C16.5164 8.4541 16.2771 8.50781 16.0688 8.61523C15.8605 8.72266 15.6961 8.8724 15.5756 9.06445C15.4584 9.25651 15.3998 9.48112 15.3998 9.73828V13H14.5502ZM20.4208 13.0928C19.9195 13.0928 19.4882 12.9821 19.1268 12.7607C18.7688 12.5394 18.4921 12.2269 18.2968 11.8232C18.1047 11.4163 18.0087 10.9378 18.0087 10.3877V10.3828C18.0087 9.83919 18.1047 9.3623 18.2968 8.95215C18.4921 8.54199 18.7671 8.22135 19.122 7.99023C19.4768 7.75911 19.8918 7.64355 20.3671 7.64355C20.8456 7.64355 21.2557 7.75423 21.5975 7.97559C21.9426 8.19694 22.2063 8.50618 22.3886 8.90332C22.5741 9.2972 22.6669 9.75618 22.6669 10.2803V10.6123H18.4481V9.93359H22.2323L21.8124 10.5537V10.2168C21.8124 9.80339 21.7505 9.46322 21.6268 9.19629C21.5031 8.92936 21.3322 8.73079 21.1141 8.60059C20.896 8.46712 20.6454 8.40039 20.3622 8.40039C20.079 8.40039 19.8251 8.47038 19.6005 8.61035C19.3791 8.74707 19.2033 8.95052 19.0731 9.2207C18.9429 9.49089 18.8778 9.82292 18.8778 10.2168V10.5537C18.8778 10.9281 18.9413 11.2487 19.0682 11.5156C19.1952 11.7793 19.3759 11.9827 19.6102 12.126C19.8446 12.266 20.1213 12.3359 20.4403 12.3359C20.6779 12.3359 20.8846 12.3034 21.0604 12.2383C21.2362 12.1732 21.3811 12.0902 21.495 11.9893C21.6089 11.8883 21.6887 11.7858 21.7343 11.6816L21.7538 11.6377H22.6034L22.5936 11.6768C22.5481 11.8558 22.4667 12.0299 22.3495 12.1992C22.2356 12.3652 22.0874 12.5166 21.9052 12.6533C21.7229 12.7868 21.5064 12.8942 21.2557 12.9756C21.0083 13.0537 20.73 13.0928 20.4208 13.0928ZM24.0452 13V7.73633H24.8948V8.52734H24.973C25.1064 8.2474 25.2985 8.03092 25.5491 7.87793C25.7998 7.72168 26.1188 7.64355 26.5062 7.64355C27.0986 7.64355 27.5527 7.81283 27.8685 8.15137C28.1875 8.48665 28.347 8.9668 28.347 9.5918V13H27.4974V9.79688C27.4974 9.32161 27.3965 8.97005 27.1946 8.74219C26.9961 8.51107 26.6868 8.39551 26.2669 8.39551C25.987 8.39551 25.7445 8.45573 25.5394 8.57617C25.3343 8.69661 25.1748 8.86751 25.0609 9.08887C24.9502 9.31022 24.8948 9.57552 24.8948 9.88477V13H24.0452ZM31.8884 13.0928C31.4457 13.0928 31.0584 12.9805 30.7263 12.7559C30.3943 12.5312 30.1371 12.2155 29.9548 11.8086C29.7726 11.3984 29.6814 10.9199 29.6814 10.373V10.3633C29.6814 9.81315 29.7726 9.33464 29.9548 8.92773C30.1371 8.52083 30.3927 8.20508 30.7214 7.98047C31.0535 7.75586 31.4425 7.64355 31.8884 7.64355C32.1293 7.64355 32.3556 7.68262 32.5671 7.76074C32.782 7.83561 32.9724 7.94141 33.1384 8.07812C33.3045 8.21484 33.4347 8.3776 33.5291 8.56641H33.6072V5.64648H34.4568V13H33.6072V12.1602H33.5291C33.4216 12.3555 33.2865 12.5231 33.1238 12.6631C32.961 12.7998 32.7755 12.9056 32.5671 12.9805C32.3588 13.0553 32.1326 13.0928 31.8884 13.0928ZM32.0837 12.3408C32.4028 12.3408 32.6778 12.2611 32.9089 12.1016C33.1401 11.9421 33.3175 11.7158 33.4412 11.4229C33.5649 11.1266 33.6267 10.7767 33.6267 10.373V10.3633C33.6267 9.95638 33.5649 9.60645 33.4412 9.31348C33.3175 9.02051 33.1401 8.79427 32.9089 8.63477C32.6778 8.47526 32.4028 8.39551 32.0837 8.39551C31.7647 8.39551 31.4897 8.47526 31.2586 8.63477C31.0307 8.79102 30.8549 9.01562 30.7312 9.30859C30.6108 9.60156 30.5505 9.95312 30.5505 10.3633V10.373C30.5505 10.7799 30.6108 11.1315 30.7312 11.4277C30.8549 11.7207 31.0307 11.9469 31.2586 12.1064C31.4897 12.2627 31.7647 12.3408 32.0837 12.3408ZM36.1672 13V7.73633H37.0168V13H36.1672ZM36.5969 6.7207C36.4374 6.7207 36.299 6.66374 36.1818 6.5498C36.0679 6.43262 36.0109 6.29427 36.0109 6.13477C36.0109 5.97201 36.0679 5.83366 36.1818 5.71973C36.299 5.60579 36.4374 5.54883 36.5969 5.54883C36.7596 5.54883 36.898 5.60579 37.0119 5.71973C37.1258 5.83366 37.1828 5.97201 37.1828 6.13477C37.1828 6.29427 37.1258 6.43262 37.0119 6.5498C36.898 6.66374 36.7596 6.7207 36.5969 6.7207ZM38.6784 13V7.73633H39.528V8.52734H39.6061C39.7396 8.2474 39.9316 8.03092 40.1823 7.87793C40.4329 7.72168 40.7519 7.64355 41.1393 7.64355C41.7317 7.64355 42.1858 7.81283 42.5016 8.15137C42.8206 8.48665 42.9801 8.9668 42.9801 9.5918V13H42.1305V9.79688C42.1305 9.32161 42.0296 8.97005 41.8278 8.74219C41.6292 8.51107 41.32 8.39551 40.9 8.39551C40.6201 8.39551 40.3776 8.45573 40.1725 8.57617C39.9674 8.69661 39.8079 8.86751 39.694 9.08887C39.5833 9.31022 39.528 9.57552 39.528 9.88477V13H38.6784ZM46.7462 14.8555C46.323 14.8555 45.9535 14.7952 45.6378 14.6748C45.322 14.5576 45.0697 14.39 44.8809 14.1719C44.6954 13.957 44.5798 13.7064 44.5343 13.4199L44.544 13.415H45.4229L45.4278 13.4199C45.4734 13.6185 45.6101 13.7812 45.838 13.9082C46.0658 14.0384 46.3686 14.1035 46.7462 14.1035C47.2182 14.1035 47.586 13.9961 47.8497 13.7812C48.1166 13.5697 48.2501 13.2702 48.2501 12.8828V11.8184H48.172C48.0613 12.0104 47.9229 12.1748 47.7569 12.3115C47.5909 12.4482 47.4037 12.5524 47.1954 12.624C46.9871 12.6924 46.7624 12.7266 46.5216 12.7266C46.0691 12.7266 45.6768 12.6191 45.3448 12.4043C45.016 12.1862 44.7621 11.8867 44.5831 11.5059C44.404 11.125 44.3145 10.6888 44.3145 10.1973V10.1875C44.3145 9.69596 44.404 9.25977 44.5831 8.87891C44.7654 8.49479 45.0225 8.19368 45.3546 7.97559C45.6866 7.75423 46.0821 7.64355 46.5411 7.64355C46.7885 7.64355 47.0164 7.68262 47.2247 7.76074C47.433 7.83887 47.6169 7.94954 47.7764 8.09277C47.9392 8.236 48.0743 8.4069 48.1817 8.60547H48.2403V7.73633H49.0899V12.9268C49.0899 13.3174 48.9939 13.6576 48.8018 13.9473C48.613 14.237 48.3428 14.46 47.9913 14.6162C47.6397 14.7757 47.2247 14.8555 46.7462 14.8555ZM46.7071 11.9746C47.0326 11.9746 47.3109 11.8997 47.5421 11.75C47.7764 11.597 47.9555 11.387 48.0792 11.1201C48.2061 10.8532 48.2696 10.5456 48.2696 10.1973V10.1875C48.2696 9.83919 48.2061 9.52995 48.0792 9.25977C47.9555 8.98958 47.7764 8.77799 47.5421 8.625C47.3109 8.47201 47.0326 8.39551 46.7071 8.39551C46.3816 8.39551 46.1049 8.47201 45.877 8.625C45.6524 8.77799 45.4799 8.98958 45.3595 9.25977C45.2423 9.52995 45.1837 9.83919 45.1837 10.1875V10.1973C45.1837 10.5456 45.2423 10.8532 45.3595 11.1201C45.4799 11.387 45.6524 11.597 45.877 11.75C46.1049 11.8997 46.3816 11.9746 46.7071 11.9746Z"
                fill="black"
            />
        </Svg>
    );
};

export const SortIcon = ({ width = 21, height = 20, ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 21 20" fill="none" {...props}>
            <Path
                d="M19.75 9.9994H7.395M3.034 9.9994H1.25M3.034 9.9994C3.034 9.42123 3.26368 8.86674 3.67251 8.45791C4.08134 8.04908 4.63583 7.8194 5.214 7.8194C5.79217 7.8194 6.34666 8.04908 6.75549 8.45791C7.16432 8.86674 7.394 9.42123 7.394 9.9994C7.394 10.5776 7.16432 11.1321 6.75549 11.5409C6.34666 11.9497 5.79217 12.1794 5.214 12.1794C4.63583 12.1794 4.08134 11.9497 3.67251 11.5409C3.26368 11.1321 3.034 10.5776 3.034 9.9994ZM19.75 16.6064H14.002M14.002 16.6064C14.002 17.1847 13.7718 17.7398 13.3628 18.1487C12.9539 18.5577 12.3993 18.7874 11.821 18.7874C11.2428 18.7874 10.6883 18.5567 10.2795 18.1479C9.87068 17.7391 9.641 17.1846 9.641 16.6064M14.002 16.6064C14.002 16.0281 13.7718 15.474 13.3628 15.0651C12.9539 14.6561 12.3993 14.4264 11.821 14.4264C11.2428 14.4264 10.6883 14.6561 10.2795 15.0649C9.87068 15.4737 9.641 16.0282 9.641 16.6064M9.641 16.6064H1.25M19.75 3.3924H16.645M12.284 3.3924H1.25M12.284 3.3924C12.284 2.81423 12.5137 2.25974 12.9225 1.85091C13.3313 1.44208 13.8858 1.2124 14.464 1.2124C14.7503 1.2124 15.0338 1.26879 15.2983 1.37835C15.5627 1.4879 15.8031 1.64848 16.0055 1.85091C16.2079 2.05334 16.3685 2.29366 16.4781 2.55815C16.5876 2.82264 16.644 3.10612 16.644 3.3924C16.644 3.67868 16.5876 3.96216 16.4781 4.22665C16.3685 4.49114 16.2079 4.73146 16.0055 4.93389C15.8031 5.13633 15.5627 5.2969 15.2983 5.40646C15.0338 5.51602 14.7503 5.5724 14.464 5.5724C13.8858 5.5724 13.3313 5.34272 12.9225 4.93389C12.5137 4.52507 12.284 3.97057 12.284 3.3924Z"
                stroke="black"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
            />
        </Svg>
    );
};

export const ReviewComponentStarIcon = ({ width = 44, height = 43, ...props }) => {
    return (
        <View
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 5, // Required for Android shadows
            }}>
            <Svg width={width} height={height} viewBox="0 0 44 43" fill="none" {...props}>
                <Path
                    d="M32 15.74L24.81 15.12L22 8.5L19.19 15.13L12 15.74L17.46 20.47L15.82 27.5L22 23.77L28.18 27.5L26.55 20.47L32 15.74ZM22 21.9L18.24 24.17L19.24 19.89L15.92 17.01L20.3 16.63L22 12.6L23.71 16.64L28.09 17.02L24.77 19.9L25.77 24.18L22 21.9Z"
                    fill="#F7B418"
                />
            </Svg>
        </View>
    );
};

export const ArrowUpward = ({ width = 24, height = 24, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
            <Path d="M20 12L18.59 10.59L13 16.17V4H11L11 16.17L5.42 10.58L4 12L12 20L20 12Z" fill={color} />
        </Svg>
    );
};

export const ArrowDownward = ({ width = 24, height = 24, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
            <Path d="M4 12L5.41 13.41L11 7.83V20H13V7.83L18.58 13.42L20 12L12 4L4 12Z" fill={color} />
        </Svg>
    );
};

export const SearchIcon = ({ width = 24, height = 24, color = "black", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
            <Path
                d="M15.755 14.255H14.965L14.685 13.985C15.665 12.845 16.255 11.365 16.255 9.755C16.255 6.165 13.345 3.255 9.755 3.255C6.165 3.255 3.255 6.165 3.255 9.755C3.255 13.345 6.165 16.255 9.755 16.255C11.365 16.255 12.845 15.665 13.985 14.685L14.255 14.965V15.755L19.255 20.745L20.745 19.255L15.755 14.255ZM9.755 14.255C7.26501 14.255 5.255 12.245 5.255 9.755C5.255 7.26501 7.26501 5.255 9.755 5.255C12.245 5.255 14.255 7.26501 14.255 9.755C14.255 12.245 12.245 14.255 9.755 14.255Z"
                fill={color}
            />
        </Svg>
    );
};

export const ChevronLeft = ({ width = 24, height = 24, color = "black" }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M17.835 3.87001L16.055 2.10001L6.16504 12L16.065 21.9L17.835 20.13L9.70504 12L17.835 3.87001Z"
                fill={color}
            />
        </Svg>
    );
};

export const StarIcon = ({ width = 12, height = 12, color = "#fc0", strokeWidth = 0.8, filled = false, ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 12 12" fill="none" {...props}>
            <Path
                d="M6.83227 5.11626L6.91845 5.4H7.215H9.75247L7.6824 6.87958L7.44749 7.04748L7.5329 7.32331L8.33943 9.92825L6.24181 8.33637L5.9998 8.15271L5.75794 8.33655L3.66606 9.92665L4.4721 7.32331L4.55757 7.04726L4.32235 6.8794L2.24917 5.4H4.785H5.08155L5.16773 5.11626L6 2.37628L6.83227 5.11626Z"
                stroke={filled ? color : "black"}
                strokeWidth={strokeWidth}
                fill={filled ? color : "none"}
            />
        </Svg>
    );
};

export const SmileyIcon = ({ width = 35, height = 35, color = "#FFCF0F", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 35 35" fill="none" {...props}>
            <Path
                d="M22.6042 16.0415C23.8123 16.0415 24.7917 15.0621 24.7917 13.854C24.7917 12.6459 23.8123 11.6665 22.6042 11.6665C21.3961 11.6665 20.4167 12.6459 20.4167 13.854C20.4167 15.0621 21.3961 16.0415 22.6042 16.0415Z"
                fill={color}
            />
            <Path
                d="M12.3959 16.0415C13.604 16.0415 14.5834 15.0621 14.5834 13.854C14.5834 12.6459 13.604 11.6665 12.3959 11.6665C11.1877 11.6665 10.2084 12.6459 10.2084 13.854C10.2084 15.0621 11.1877 16.0415 12.3959 16.0415Z"
                fill={color}
            />
            <Path
                d="M17.5 23.3332C15.3417 23.3332 13.4896 22.1519 12.4688 20.4165H10.0334C11.2 23.4061 14.1021 25.5207 17.5 25.5207C20.8979 25.5207 23.8 23.4061 24.9667 20.4165H22.5313C21.5104 22.1519 19.6584 23.3332 17.5 23.3332ZM17.4854 2.9165C9.43544 2.9165 2.91669 9.44984 2.91669 17.4998C2.91669 25.5498 9.43544 32.0832 17.4854 32.0832C25.55 32.0832 32.0834 25.5498 32.0834 17.4998C32.0834 9.44984 25.55 2.9165 17.4854 2.9165ZM17.5 29.1665C11.0542 29.1665 5.83335 23.9457 5.83335 17.4998C5.83335 11.054 11.0542 5.83317 17.5 5.83317C23.9459 5.83317 29.1667 11.054 29.1667 17.4998C29.1667 23.9457 23.9459 29.1665 17.5 29.1665Z"
                fill={color}
            />
        </Svg>
    );
};

export const ThumbsUpIcon = ({ width = 35, height = 35, color = "#FFCF0F", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 35 35" fill="none" {...props}>
            <Path
                d="M17.5 2.9165C14.6157 2.9165 11.7962 3.7718 9.39796 5.37424C6.99974 6.97668 5.13056 9.25428 4.02678 11.919C2.92301 14.5838 2.63421 17.516 3.19691 20.3449C3.75961 23.1738 5.14854 25.7723 7.18805 27.8118C9.22757 29.8513 11.8261 31.2403 14.655 31.803C17.4838 32.3657 20.4161 32.0769 23.0808 30.9731C25.7456 29.8693 28.0232 28.0001 29.6256 25.6019C31.2281 23.2037 32.0834 20.3841 32.0834 17.4998C32.0834 15.5847 31.7062 13.6884 30.9733 11.919C30.2404 10.1497 29.1662 8.54205 27.812 7.18786C26.4578 5.83368 24.8502 4.75948 23.0808 4.02659C21.3115 3.29371 19.4151 2.9165 17.5 2.9165ZM26.25 17.2082C26.2727 17.4602 26.2221 17.7134 26.1042 17.9373L23.0417 25.0832C22.882 25.4475 22.6149 25.7544 22.2761 25.9628C21.9374 26.1713 21.543 26.2714 21.1459 26.2498H13.125C12.3515 26.2498 11.6096 25.9425 11.0626 25.3956C10.5157 24.8486 10.2084 24.1067 10.2084 23.3332V16.0415C10.1938 15.7706 10.2384 15.4999 10.3392 15.248C10.4399 14.9961 10.5943 14.7693 10.7917 14.5832L17.5 7.2915L18.5063 8.29775C18.7712 8.57362 18.9267 8.93647 18.9438 9.31859V9.61025L18.0979 14.5832H24.7917C25.1785 14.5832 25.5494 14.7368 25.8229 15.0103C26.0964 15.2838 26.25 15.6547 26.25 16.0415V17.2082Z"
                fill={color}
            />
        </Svg>
    );
};

export const PersonWavingIcon = ({ width = 35, height = 35, color = "#FDD329", ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 35 35" fill="none" {...props}>
            <Path
                d="M17.2375 8.74984C18.8484 8.74984 20.1542 7.444 20.1542 5.83317C20.1542 4.22234 18.8484 2.9165 17.2375 2.9165C15.6267 2.9165 14.3209 4.22234 14.3209 5.83317C14.3209 7.444 15.6267 8.74984 17.2375 8.74984Z"
                fill={color}
            />
            <Path
                d="M22.9104 11.8269C22.3417 11.2582 21.3646 10.2082 19.4688 10.2082C19.1625 10.2082 17.3979 10.2082 15.7646 10.2082C11.7542 10.1936 8.48753 6.92692 8.48753 2.9165H5.57086C5.57086 7.52484 8.64794 11.4332 12.8625 12.7019V32.0832H15.7792V23.3332H18.6959V32.0832H21.6125V14.6561L27.3729 20.4165L29.4292 18.3603L22.9104 11.8269Z"
                fill={color}
            />
        </Svg>
    );
};

export const FilterIcon = ({ width = 18, height = 12, ...props }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 18 12" fill="none" {...props}>
            <Path
                d="M8 12H10C10.55 12 11 11.55 11 11C11 10.45 10.55 10 10 10H8C7.45 10 7 10.45 7 11C7 11.55 7.45 12 8 12ZM0 1C0 1.55 0.45 2 1 2H17C17.55 2 18 1.55 18 1C18 0.45 17.55 0 17 0H1C0.45 0 0 0.45 0 1ZM4 7H14C14.55 7 15 6.55 15 6C15 5.45 14.55 5 14 5H4C3.45 5 3 5.45 3 6C3 6.55 3.45 7 4 7Z"
                fill="black"
            />
        </Svg>
    );
};

export const RestaurantIcon = ({ width = 24, height = 24, color = "black" }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M20.16 7.8C20.07 7.34 19.66 7 19.18 7H4.82C4.34 7 3.93 7.34 3.84 7.8L3 12V13C3 13.55 3.45 14 4 14V19C4 19.55 4.45 20 5 20H13C13.55 20 14 19.55 14 19V14H18V19C18 19.55 18.45 20 19 20C19.55 20 20 19.55 20 19V14C20.55 14 21 13.55 21 13V12L20.16 7.8ZM12 18H6V14H12V18ZM5 6H19C19.55 6 20 5.55 20 5C20 4.45 19.55 4 19 4H5C4.45 4 4 4.45 4 5C4 5.55 4.45 6 5 6Z"
                fill={color}
            />
        </Svg>
    );
};
