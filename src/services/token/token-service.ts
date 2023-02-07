import { StorageClient } from "./../../common/clients/storage-client/storage-client";
import { TokenRepository } from "@/repositories/token";
import { TokenModelMapper } from "@/models/token/mapper/token-model-mapper";
import { returnNullWithLog } from "@/common/utils/error-util";

export class TokenService {
	private tokenRepository: TokenRepository;
	private storageClient: StorageClient;

	constructor(tokenRepository: TokenRepository, storageClient: StorageClient) {
		this.tokenRepository = tokenRepository;
		this.storageClient = storageClient;
	}

	public getTokenById = async (tokenId: string) => {
		return await this.tokenRepository
			.getTokenById(tokenId)
			.then(res => TokenModelMapper.fromResponse(res))
			.catch(returnNullWithLog);
	};
}
