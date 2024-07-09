import Button from '@/components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '@/components/bootstrap/Card';
import EditDEXOffCanvas from '@/containers/manage/dexes/EditDEXOffcanvas/EditDexOffcanvas';
import { formatDateTime } from '@/helpers';
import useQueryDexes from '@/hooks/api/useQueryDexes';
import useOnEventCallback from '@/hooks/useOnEventCallback';
import Page from '@/layout/Page/Page';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';
import { TDEX } from '@/type/data/dexes.type';
import classNames from 'classnames';
import { useState } from 'react';

const DEXListPage = () => {
	const { data, refetch } = useQueryDexes();

	const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(false);
	const [modifiedDEX, setModifiedDEX] = useState<TDEX | null>(null);

	const handleEditDEX = useOnEventCallback((chain: TDEX | null) => {
		return () => {
			setIsCanvasOpen(true);
			setModifiedDEX(chain);
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
								<CardTitle>DEXes</CardTitle>
							</CardLabel>
							<CardActions>
								<Button color="info" icon="Add" isLight onClick={handleEditDEX(null)}>
									Add
								</Button>
							</CardActions>
						</CardHeader>
						<CardBody className="table-responsive">
							<table className="table table-modern">
								<thead>
									<tr>
										<th>Name</th>
										<th>Created Time</th>
										<th>Updated Time</th>
										<td />
									</tr>
								</thead>
								<tbody>
									{data?.map((dex) => {
										return (
											<tr key={dex.id}>
												<td>{dex.name}</td>
												<td>{formatDateTime(dex.createdAt)}</td>
												<td>{formatDateTime(dex.updatedAt)}</td>
												<td>
													<Button
														color="light"
														className={classNames('text-nowrap', 'border-light')}
														icon="Edit"
														onClick={handleEditDEX(dex)}
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
						<EditDEXOffCanvas
							mode={modifiedDEX ? 'edit' : 'add'}
							dex={modifiedDEX}
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

export default DEXListPage;
