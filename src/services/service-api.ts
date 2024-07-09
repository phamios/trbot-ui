import { TJwtTokenData, TUser } from '@/type/data/auth.type';
import { TAddChain, TChain, TUpdateChain } from '@/type/data/chains.type';
import { TAddDEXRouter, TDEXRouter, TUpdateDEXRouter } from '@/type/data/dex-routers.type';
import { TAddDEX, TDEX, TUpdateDEX } from '@/type/data/dexes.type';
import { ApiResponse } from '@/type/data/response.type';
import { TSnipe, TSnipeAction, TSnipeData } from '@/type/data/snipes.type';
import { TAddTradingContract, TTradingContract, TUpdateTradingContract } from '@/type/data/trading-contracts.type';
import { TWalletCompletedTransaction } from '@/type/data/transaction.type';
import { TWallet, TWalletApprovalStatus, TWalletBalance } from '@/type/data/wallets.type';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import ServiceAuth from './service-auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ServiceAPI {
	private static _handleError(e: Error) {
		if (e instanceof AxiosError) {
			throw new Error(e.response?.data?.message);
		}
		throw e;
	}

	private static _setAuthHeader(config: AxiosRequestConfig) {
		const token = ServiceAuth.getToken();
		if (!token) {
			throw new Error('Not authenticated');
		}
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	private static _get = async <T>(
		path: string,
		params: Record<string, unknown> = {},
		requiredAuth: boolean = true,
	): Promise<T | undefined> => {
		try {
			const apiUrl = new URL(`${API_URL}${path}`);
			for (const key in params) {
				apiUrl.searchParams.append(key, String(params[key]));
			}

			const config: AxiosRequestConfig = {
				method: 'GET',
				url: apiUrl.toString(),
			};

			requiredAuth && this._setAuthHeader(config);

			const response = await axios(config);
			return response.data as T;
		} catch (e: any) {
			this._handleError(e);
		}
	};

	private static _post = async <T>(
		path: string,
		data?: Record<string, unknown>,
		requiredAuth: boolean = true,
	): Promise<T | undefined> => {
		try {
			const config: AxiosRequestConfig = {
				method: 'POST',
			};

			requiredAuth && this._setAuthHeader(config);

			const response = await axios.post(`${API_URL}${path}`, data, config);
			return response.data as T;
		} catch (e: any) {
			this._handleError(e);
		}
	};

	private static _patch = async <T>(
		path: string,
		data?: Record<string, unknown>,
		requiredAuth: boolean = true,
	): Promise<T | undefined> => {
		try {
			const config: AxiosRequestConfig = {
				method: 'PATCH',
			};

			requiredAuth && this._setAuthHeader(config);

			const response = await axios.patch(`${API_URL}${path}`, data, config);
			return response.data as T;
		} catch (e: any) {
			this._handleError(e);
		}
	};

	private static _delete = async <T>(
		path: string,
		data?: Record<string, unknown>,
		requiredAuth: boolean = true,
	): Promise<T | undefined> => {
		try {
			const config: AxiosRequestConfig = {
				method: 'DELETE',
			};

			requiredAuth && this._setAuthHeader(config);

			const response = await axios.delete(`${API_URL}${path}`, config);
			return response.data as T;
		} catch (e: any) {
			this._handleError(e);
		}
	};

	static async login(email: string, password: string): Promise<string> {
		const data = await this._post<ApiResponse<TJwtTokenData>>(
			'/auth/login',
			{
				email,
				password,
			},
			false, // auth not required
		);
		return data?.data.token as string;
	}

	static async me(): Promise<TUser> {
		const data = await this._get<ApiResponse<TUser>>('/auth/me');
		return data?.data as TUser;
	}

	static async getChains(): Promise<TChain[]> {
		const data = await this._get<ApiResponse<TChain[]>>('/chains');
		return data?.data as TChain[];
	}

	static async createChain(dto: TAddChain): Promise<TChain> {
		const data = await this._post<ApiResponse<TChain>>('/chains', dto);
		return data?.data as TChain;
	}

	static async updateChain(id: number, dto: TUpdateChain): Promise<boolean> {
		const data = await this._patch<ApiResponse<boolean>>(`/chains/${id}`, dto);
		return data?.data as boolean;
	}

	static async deleteChain(id: number): Promise<boolean> {
		const data = await this._delete<ApiResponse<boolean>>(`/chains/${id}`);
		return data?.data as boolean;
	}

	static async getDexes(): Promise<TDEX[]> {
		const data = await this._get<ApiResponse<TDEX[]>>('/dexes');
		return data?.data as TDEX[];
	}

	static async createDex(dto: TAddDEX): Promise<TDEX> {
		const data = await this._post<ApiResponse<TDEX>>('/dexes', dto);
		return data?.data as TDEX;
	}

	static async updateDex(id: number, dto: TUpdateDEX): Promise<boolean> {
		const data = await this._patch<ApiResponse<boolean>>(`/dexes/${id}`, dto);
		return data?.data as boolean;
	}

	static async deleteDex(id: number): Promise<boolean> {
		const data = await this._delete<ApiResponse<boolean>>(`/dexes/${id}`);
		return data?.data as boolean;
	}

	static async getDexRouters(): Promise<TDEXRouter[]> {
		const data = await this._get<ApiResponse<TDEXRouter[]>>('/dex-routers');
		return data?.data as TDEXRouter[];
	}

	static async getDexRoutersByChainId(chainId: string): Promise<TDEXRouter[]> {
		const data = await this._get<ApiResponse<TDEXRouter[]>>('/dex-routers/get-by-chain', {
			chainId,
		});
		return data?.data as TDEXRouter[];
	}

	static async getDexRouterById(id: number): Promise<TDEXRouter> {
		const data = await this._get<ApiResponse<TDEXRouter>>(`/dex-routers/${id}`);
		return data?.data as TDEXRouter;
	}

	static async createDexRouter(dto: TAddDEXRouter): Promise<TDEXRouter> {
		const data = await this._post<ApiResponse<TDEXRouter>>('/dex-routers', dto);
		return data?.data as TDEXRouter;
	}

	static async updateDexRouter(id: number, dto: TUpdateDEXRouter): Promise<boolean> {
		const data = await this._patch<ApiResponse<boolean>>(`/dex-routers/${id}`, dto);
		return data?.data as boolean;
	}

	static async deleteDexRouter(id: number): Promise<boolean> {
		const data = await this._delete<ApiResponse<boolean>>(`/dex-routers/${id}`);
		return data?.data as boolean;
	}

	static async getTradingContracts(): Promise<TTradingContract[]> {
		const data = await this._get<ApiResponse<TTradingContract[]>>('/trading-contracts');
		return data?.data as TTradingContract[];
	}

	static async getTradingContractById(id: number): Promise<TTradingContract> {
		const data = await this._get<ApiResponse<TTradingContract>>(`/trading-contracts/${id}`);
		return data?.data as TTradingContract;
	}

	static async createTradingContract(dto: TAddTradingContract): Promise<TTradingContract> {
		const data = await this._post<ApiResponse<TTradingContract>>('/trading-contracts', dto);
		return data?.data as TTradingContract;
	}

	static async updateTradingContract(id: number, dto: TUpdateTradingContract): Promise<boolean> {
		const data = await this._patch<ApiResponse<boolean>>(`/trading-contracts/${id}`, dto);
		return data?.data as boolean;
	}

	static async deleteTradingContract(id: number): Promise<boolean> {
		const data = await this._delete<ApiResponse<boolean>>(`/trading-contracts/${id}`);
		return data?.data as boolean;
	}

	static async getWallet(): Promise<TWallet> {
		const data = await this._get<ApiResponse<TWallet>>(`/wallet`);
		return data?.data as TWallet;
	}

	static async getBalance(chainId: string): Promise<TWalletBalance> {
		const data = await this._get<ApiResponse<TWalletBalance>>(`/wallet/balance`, {
			chainId,
		});
		return data?.data as TWalletBalance;
	}

	static async getErc20Balance(contractId: number): Promise<TWalletBalance> {
		const data = await this._get<ApiResponse<TWalletBalance>>(`/wallet/erc20-balance`, {
			contractId,
		});
		return data?.data as TWalletBalance;
	}

	static async checkWETHApprovalStatus(dexRouterId: number): Promise<TWalletApprovalStatus> {
		const data = await this._post<ApiResponse<TWalletApprovalStatus>>(`/wallet/check-weth-approval`, {
			dexRouterId,
		});
		return data?.data as TWalletApprovalStatus;
	}

	static async checkApprovalStatus(contractId: number, routerId: number): Promise<TWalletApprovalStatus> {
		const data = await this._post<ApiResponse<TWalletApprovalStatus>>(`/wallet/check-approval`, {
			contractId,
			dexRouterId: routerId,
		});
		return data?.data as TWalletApprovalStatus;
	}

	static async approveContract(contractId: number, routerId: number): Promise<TWalletCompletedTransaction> {
		const data = await this._post<ApiResponse<TWalletCompletedTransaction>>(`/wallet/approve`, {
			contractId,
			dexRouterId: routerId,
		});
		return data?.data as TWalletCompletedTransaction;
	}

	static async approveWETH(dexRouterId: number): Promise<TWalletCompletedTransaction> {
		const data = await this._post<ApiResponse<TWalletCompletedTransaction>>(`/wallet/approve-weth`, {
			dexRouterId,
		});
		return data?.data as TWalletCompletedTransaction;
	}

	static async swap(contractId: number, routerId: number, amountIn: string): Promise<TWalletCompletedTransaction> {
		const data = await this._post<ApiResponse<TWalletCompletedTransaction>>(`/swap`, {
			contractId,
			dexRouterId: routerId,
			exactAmountIn: amountIn,
		});
		return data?.data as TWalletCompletedTransaction;
	}

	static async getSnipesByContractId(contractId: number): Promise<TSnipe[]> {
		const data = await this._get<ApiResponse<TSnipe[]>>(`/snipes`, { contractId });
		return data?.data as TSnipe[];
	}

	static async getSnipeById(id: number): Promise<TSnipe> {
		const data = await this._get<ApiResponse<TSnipe>>(`/snipes/${id}`);
		return data?.data as TSnipe;
	}

	static async getSnipeDataById(id: number): Promise<TSnipeData> {
		const data = await this._get<ApiResponse<TSnipeData>>(`/snipes/data/${id}`);
		return data?.data as TSnipeData;
	}

	static async snipeSwapEthToTokens(action: TSnipeAction): Promise<number> {
		const data = await this._post<ApiResponse<number>>(`/snipes/swap-eth-to-token`, action);
		return data?.data as number;
	}

	static async deleteSnipe(id: number): Promise<boolean> {
		const data = await this._delete<ApiResponse<boolean>>(`/snipes/${id}`);
		return data?.data as boolean;
	}
}

export default ServiceAPI;
