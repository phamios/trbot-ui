import Button from '@/components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '@/components/bootstrap/Card';
import EthereumAddress from '@/components/EthereumAddress';
import EditTradingContractOffCanvas from '@/containers/manage/contracts/EditTradingContractOffcanvas/EditTradingContractOffcanvas';
import { formatDateTime } from '@/helpers';
import useQueryTradingContracts from '@/hooks/api/useQueryTradingContracts';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import Page from '@/layout/Page/Page';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import { TTradingContract } from '@/type/data/trading-contracts.type';
import classNames from 'classnames';
import pascalcase from 'pascalcase';
import { useState } from 'react';

const TradingContractListPage = () => {
	const { data, refetch } = useQueryTradingContracts();

	const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(false);
	const [modifiedContract, setModifiedContract] = useState<TTradingContract | null>(null);

	const handleEditTradingContract = useOnEventCallback((chain: TTradingContract | null) => {
		return () => {
			setIsCanvasOpen(true);
			setModifiedContract(chain);
		};
	});

	const onEditSuccess = useOnEventCallback(() => {
		setIsCanvasOpen(false);
		refetch();
	});

	return (
		<PageWrapper isProtected={true}>
			<Page container="fluid">
				<div className="col-12">
					<Card>
						<CardHeader borderSize={1}>
							<CardLabel icon="List" iconColor="info">
								<CardTitle>Contracts</CardTitle>
							</CardLabel>
							<CardActions>
								<Button color="info" icon="Add" isLight onClick={handleEditTradingContract(null)}>
									Add
								</Button>
							</CardActions>
						</CardHeader>
						<CardBody className="table-responsive">
							<table className="table table-modern">
								<thead>
									<tr>
										<th>Name</th>
										<th>Symbol</th>
										<th>Chain</th>
										<th>Address</th>
										<th>Decimals</th>
										<th>Created Time</th>
										<th>Updated Time</th>
										<td />
									</tr>
								</thead>
								<tbody>
									{data?.map((contract) => {
										return (
											<tr key={contract.id}>
												<td>{contract.name}</td>
												<td>{contract.symbol}</td>
												<td>{contract.chain.name || 'Unknown'}</td>
												<td>
													<EthereumAddress shorten address={contract.address} />
												</td>
												<td>{contract.decimals}</td>
												<td>{formatDateTime(contract.createdAt)}</td>
												<td>{formatDateTime(contract.updatedAt)}</td>
												<td>
													<Button
														color="light"
														className={classNames('text-nowrap', 'border-light')}
														icon="Edit"
														onClick={handleEditTradingContract(contract)}
													>
														Edit
													</Button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</CardBody>
					</Card>

					{isCanvasOpen && (
						<EditTradingContractOffCanvas
							mode={modifiedContract ? 'edit' : 'add'}
							contract={modifiedContract}
							isOpen={isCanvasOpen}
							setOpen={setIsCanvasOpen}
							onSuccess={onEditSuccess}
						/>
					)}
				</div>
			</Page>
		</PageWrapper>
	);
};

export default TradingContractListPage;
