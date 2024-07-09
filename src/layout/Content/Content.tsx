import Card, { CardBody } from '@/components/bootstrap/Card';
import { FC, ReactNode } from 'react';
import Page from '@/layout/Page/Page';
import PageWrapper from '@/layout/PageWrapper/PageWrapper';

const LOADING = (
	<PageWrapper>
		<Page>
			<div className="row h-100">
				<div className="col-lg-6">
					<Card stretch>
						<CardBody>
							<div />
						</CardBody>
					</Card>
				</div>
				<div className="col-lg-6">
					<Card stretch="semi">
						<CardBody>
							<div />
						</CardBody>
					</Card>
					<Card stretch="semi">
						<CardBody>
							<div />
						</CardBody>
					</Card>
				</div>
			</div>
		</Page>
	</PageWrapper>
);

interface IContent {
	children: ReactNode;
}
const Content: FC<IContent> = ({ children }) => {
	return <main className="content">{children}</main>;
};

export default Content;
