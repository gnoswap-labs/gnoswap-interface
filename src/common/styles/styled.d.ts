import "styled-components";
import {
	DarkColorsTypes,
	LightColorsTypes,
	FontsType,
	BoxShadowTypes,
} from "./theme";

declare module "styled-components" {
	export interface DefaultTheme {
		lightColor: LightColorsTypes;
		darkColor: DarkColorsTypes;
		boxShadow: BoxShadowTypes;
	}
}
