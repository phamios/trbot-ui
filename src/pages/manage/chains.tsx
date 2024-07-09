import Button from '@/components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '@/components/bootstrap/Card';
import EditChainOffCanvas from '@/containers/manage/chains/EditChainOffcanvas/EditChainOffCanvas';
import { formatDateTime } from '@/helpers';
import useQueryChains from '@/hooks/api/useQueryChains';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import Page from '@/layout/Page/Page';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import { TChain } from '@/type/data/chains.type';
import classNames from 'classnames';
import moment from 'moment';
import { useState } from 'react';

const ChainListPage = () => {
	const { data, refetch } = useQueryChains();

	const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(false);
	const [modifiedChain, setModifiedChain] = useState<TChain | null>(null);

	const handleEditChain = useOnEventCallback((chain: TChain | null) => {
		return () => {
			setIsCanvasOpen(true);
			setModifiedChain(chain);
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
								<CardTitle>Chains</CardTitle>
							</CardLabel>
							<CardActions>
								<Button color="info" icon="Add" isLight onClick={handleEditChain(null)}>
									Add
								</Button>
							</CardActions>
						</CardHeader>
						<CardBody className="table-responsive">
							<table className="table table-modern">
								<thead>
									<tr>
										<th>Chain ID</th>
										<th>Name</th>
										<th>Created Time</th>
										<th>Updated Time</th>
										<td />
									</tr>
								</thead>
								<tbody>
									{data?.map((chain) => {
										return (
											<tr key={chain.id}>
												<td>{chain.chainId}</td>
												<td>{chain.name}</td>
												<td>{formatDateTime(chain.createdAt)}</td>
												<td>{formatDateTime(chain.updatedAt)}</td>
												<td>
													<Button
														color="light"
														className={classNames('text-nowrap', 'border-light')}
														icon="Edit"
														onClick={handleEditChain(chain)}
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
						<EditChainOffCanvas
							mode={modifiedChain ? 'edit' : 'add'}
							chain={modifiedChain}
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

export default ChainListPage;
