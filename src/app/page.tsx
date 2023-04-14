'use client';
import { Button, Card } from 'react-daisyui';

export default function HomePage(): JSX.Element | null {
  return (
    <div>
      <Card className="bg-gradient-to-r from-[#0f0f34] to-[#191958]">
        <Card.Image src="/bowser.png" alt="Shoes" />
        <Card.Body>
          <Card.Title tag="h2">Shoes!</Card.Title>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <Card.Actions className="justify-end">
            <Button color="primary">Upload</Button>
          </Card.Actions>
        </Card.Body>
      </Card>
    </div>
  );
}
