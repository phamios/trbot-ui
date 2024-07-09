/* eslint-disable react/display-name */
import React from 'react';
import { AuthContextProvider } from './AuthContext';

const combineComponents = (...components: React.FC<any>[]): React.FC<any> => {
	return components.reduce(
		(AccumulatedComponents, CurrentComponent) => {
			return ({ children }: React.ComponentProps<React.FC<any>>): JSX.Element => {
				return (
					<AccumulatedComponents>
						<CurrentComponent>{children}</CurrentComponent>
					</AccumulatedComponents>
				);
			};
		},
		({ children }) => <>{children}</>,
	);
};

// Add context providers here
const providers = [AuthContextProvider];

const AppContextProvider = combineComponents(...providers);

export default AppContextProvider;
