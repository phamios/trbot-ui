import Button from '@/components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '@/components/bootstrap/Card';
import EthereumAddress from '@/components/EthereumAddress';
import EditDEXRouterOffCanvas from '@/containers/manage/dex-routers/EditDEXRouterOffcanvas/EditDEXRouterOffcanvas';
import { formatDateTime } from '@/helpers';
import useQueryDexRouters from '@/hooks/api/useQueryDexRouters';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import Page from '@/layout/Page/Page';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import { TDEXRouter } from '@/type/data/dex-routers.type';
import classNames from 'classnames';
import pascalcase from 'pascalcase';
import { useState } from 'react';

const DEXRouterListPage = () => {
	const { data, refetch } = useQueryDexRouters();

	const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(false);
	const [modifiedRouter, setModifiedRouter] = useState<TDEXRouter | null>(null);

	const handleEditRouter = useOnEventCallback((chain: TDEXRouter | null) => {
		return () => {
			setIsCanvasOpen(true);
			setModifiedRouter(chain);
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
								<CardTitle>DEX Routers</CardTitle>
							</CardLabel>
							<CardActions>
								<Button color="info" icon="Add" isLight onClick={handleEditRouter(null)}>
									Add
								</Button>
							</CardActions>
						</CardHeader>
						<CardBody className="table-responsive">
							<table className="table table-modern">
								<thead>
									<tr>
										<th>Name</th>
										<th>Chain</th>
										<th>Protocol version</th>
										<th>Type</th>
										<th>Address</th>
										<th>DEX</th>
										<th>Created Time</th>
										<th>Updated Time</th>
										<td />
									</tr>
								</thead>
								<tbody>
									{data?.map((router) => {
										return (
											<tr key={router.id}>
												<td>{router.name}</td>
												<td>{router.chain?.name || 'Unknown'}</td>
												<td>{`V${router.protocolVersion}`}</td>
												<td>{pascalcase(router.type)}</td>
												<td>
													<EthereumAddress shorten address={router.address} />
												</td>
												<td>{router.dex?.name || 'Unknown'}</td>
												<td>{formatDateTime(router.createdAt)}</td>
												<td>{formatDateTime(router.updatedAt)}</td>
												<td>
													<Button
														color="light"
														className={classNames('text-nowrap', 'border-light')}
														icon="Edit"
														onClick={handleEditRouter(router)}
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
						<EditDEXRouterOffCanvas
							mode={modifiedRouter ? 'edit' : 'add'}
							router={modifiedRouter}
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

export default DEXRouterListPage;
