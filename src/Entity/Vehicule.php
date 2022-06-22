<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\VehiculeRepository;
use DateTime;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: VehiculeRepository::class)]
#[UniqueEntity("identification", message: "A vehicule with this identification already exists")]
#[ApiResource(
    collectionOperations: [
        'GET',
        'POST'
    ],
    itemOperations: [
        'DELETE',
        'GET' => [
            'normalization_context' => ['groups' => ['read:vehicule:item']]
        ],
        'PUT'
    ],
    subresourceOperations: [
        'maintenances_get_subresource' => [
            'method' => 'GET',
            'path'   => '/vehicules/{id}/maintenances'
        ]
    ],
    denormalizationContext: ['groups' => ['write:vehicule:item']],
    normalizationContext: ['groups' => ['read:vehicule:collection']],
    order: ['id' => 'ASC'],
    paginationItemsPerPage: 10
)]
#[ApiFilter(
    SearchFilter::class, properties: [
        'brand'     => 'partial',
        'reference' => 'partial',
        'users'     => 'exact'
    ]
)]
#[ApiFilter(
    OrderFilter::class, properties: [
        'brand',
        'reference'
    ]
)]
class Vehicule
{
    public const TYPE = [
        'CAR'        => 'car',
        'MOTORCYCLE' => 'motorcycle',
        'SCOOTER'    => 'scooter'
    ];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(['read:vehicule:item', 'read:vehicule:collection', 'read:user:item'])]
    private ?int $id;

    #[ORM\Column(type: 'string', length: 20)]
    #[Groups(['read:vehicule:item', 'read:vehicule:collection', 'write:vehicule:item'])]
    #[Assert\Choice(
        choices: [
            Vehicule::TYPE['CAR'],
            Vehicule::TYPE['MOTORCYCLE'],
            Vehicule::TYPE['SCOOTER']
        ]
    )]
    private ?string $type;

    #[ORM\Column(type: 'string', length: 20)]
    #[Groups(['read:vehicule:item', 'read:vehicule:collection', 'write:vehicule:item'])]
    private ?string $identification;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['read:vehicule:item', 'read:vehicule:collection', 'write:vehicule:item'])]
    private ?string $brand;

    #[ORM\Column(type: 'string', length: 100)]
    #[Groups(['read:vehicule:item', 'read:vehicule:collection', 'write:vehicule:item'])]
    private ?string $reference;

    #[ORM\Column(type: 'integer')]
    #[Groups(['read:vehicule:item', 'read:vehicule:collection', 'write:vehicule:item'])]
    private ?int $modelyear;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['read:vehicule:item'])]
    private ?DateTime $createdAt;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'vehicules')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read:vehicule:item', 'read:vehicule:collection', 'write:vehicule:item'])]
    private ?User $user;

    #[ORM\OneToMany(mappedBy: 'vehicule', targetEntity: Maintenance::class, orphanRemoval: true)]
    #[Groups(['read:vehicule:item', 'read:vehicule:collection'])]
    #[ApiSubresource()]
    private Collection $maintenances;

    public function __construct()
    {
        $this->maintenances = new ArrayCollection();
        $this->createdAt    = new DateTime();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return $this
     */
    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getIdentification(): ?string
    {
        return $this->identification;
    }

    /**
     * @param string $identification
     * @return $this
     */
    public function setIdentification(string $identification): self
    {
        $this->identification = $identification;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getBrand(): ?string
    {
        return $this->brand;
    }

    /**
     * @param string $brand
     * @return $this
     */
    public function setBrand(string $brand): self
    {
        $this->brand = $brand;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getReference(): ?string
    {
        return $this->reference;
    }

    /**
     * @param string $reference
     * @return $this
     */
    public function setReference(string $reference): self
    {
        $this->reference = $reference;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getModelyear(): ?int
    {
        return $this->modelyear;
    }

    /**
     * @param int $modelyear
     * @return $this
     */
    public function setModelyear(int $modelyear): self
    {
        $this->modelyear = $modelyear;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     * @return $this
     */
    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return DateTime|null
     */
    public function getCreatedAt(): ?DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param DateTime $createdAt
     * @return $this
     */
    public function setCreatedAt(DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection<int, Maintenance>
     */
    public function getMaintenances(): Collection
    {
        return $this->maintenances;
    }

    /**
     * @param Maintenance $maintenance
     * @return $this
     */
    public function addMaintenance(Maintenance $maintenance): self
    {
        if (!$this->maintenances->contains($maintenance)) {
            $this->maintenances[] = $maintenance;
            $maintenance->setVehicule($this);
        }

        return $this;
    }

    /**
     * @param Maintenance $maintenance
     * @return $this
     */
    public function removeMaintenance(Maintenance $maintenance): self
    {
        if ($this->maintenances->removeElement($maintenance)) {
            // set the owning side to null (unless already changed)
            if ($maintenance->getVehicule() === $this) {
                $maintenance->setVehicule(null);
            }
        }

        return $this;
    }
}
