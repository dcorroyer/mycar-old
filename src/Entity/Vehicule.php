<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\VehiculeRepository")
 * @UniqueEntity("identification", message="Un véhicule ayant cette immatriculation existe déjà")
 *
 * @ApiResource(
 *      collectionOperations={"GET", "POST"},
 *      itemOperations={"GET", "PUT", "PATCH", "DELETE"},
 *      subresourceOperations={
 *          "maintenances_get_subresource"={"path"="/vehicules/{id}/maintenances"},
 *          "api_users_vehicules_get_subresource"={
 *              "normalization_context"={"groups"={"vehicules_subresource"}}
 *          }
 *      },
 *     attributes={
 *          "order": {"identification":"ASC"}
 *     },
 *     normalizationContext={
 *          "groups"={"vehicules_read"}
 *     },
 *     denormalizationContext={
 *         "disable_type_enforcement"=true
 *     }
 * )
 */
class Vehicule
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"vehicules_read", "users_read", "maintenances_read", "vehicules_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Groups({"vehicules_read", "users_read", "maintenances_read", "vehicules_subresource"})
     * @Assert\NotBlank(message="Le type du véhicule est obligatoire")
     * @Assert\Choice(choices={"Voiture", "Moto", "Scooter"},
     *     message="Le type du véhicule doit être Voiture, Moto ou Scooter")
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=20)
     * @Groups({"vehicules_read", "users_read", "maintenances_read", "vehicules_subresource"})
     * @Assert\NotBlank(message="Le numéro d'immatriculation du véhicule est obligatoire")
     * @Assert\Length(min="2", minMessage="Le numéro d'immatriculation du véhicule doit faire entre 2 et 20 caractères",
     *     max="20", maxMessage="Le numéro d'immatriculation du véhicule doit faire entre 2 et 20 caractères")
     */
    private $identification;

    /**
     * @ORM\Column(type="string", length=100)
     * @Groups({"vehicules_read", "users_read", "maintenances_read", "vehicules_subresource"})
     * @Assert\NotBlank(message="La marque du véhicule est obligatoire")
     * @Assert\Length(min="2", minMessage="La marque du véhicule doit faire entre 2 et 100 caractères",
     *     max="100", maxMessage="La marque du véhicule doit faire entre 2 et 100 caractères")
     */
    private $brand;

    /**
     * @ORM\Column(type="string", length=100)
     * @Groups({"vehicules_read", "users_read", "maintenances_read", "vehicules_subresource"})
     * @Assert\NotBlank(message="Le modèle du véhicule est obligatoire")
     * @Assert\Length(min="2", minMessage="Le modèle du véhicule doit faire entre 2 et 100 caractères",
     *     max="100", maxMessage="Le modèle du véhicule doit faire entre 2 et 100 caractères")
     */
    private $reference;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"vehicules_read", "users_read", "maintenances_read", "vehicules_subresource"})
     * @Assert\NotBlank(message="La date de première mise en circulation du véhicule est obligatoire")
     */
    private $modelyear;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="vehicules")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"vehicules_read", "maintenances_read"})
     * @Assert\NotBlank(message="Le propriétaire du véhicule est obligatoire")
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Maintenance", mappedBy="vehicule", orphanRemoval=true)
     * @Groups({"vehicules_read"})
     * @ApiSubresource()
     */
    private $maintenances;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"vehicules_read", "users_read", "vehicules_subresource"})
     * @Assert\NotBlank(message="Le chrono du vehicule est obligatoire")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    private $chrono;

    public function __construct()
    {
        $this->maintenances = new ArrayCollection();
    }

    /**
     * Permet de récupérer le nombre total des maintenances
     * @Groups({"vehicules_read"})
     * @return int
     */
    public function getNbAmount(): int
    {
        return count($this->maintenances);
    }

    /**
     * Permet de récupérer le total des maintenances
     * @Groups({"vehicules_read"})
     * @return float
     */
    public function getTotalAmount(): float
    {
        return array_reduce($this->maintenances->toArray(), function ($total, $maintenance) {
            return $total + $maintenance->getAmount();
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getIdentification(): ?string
    {
        return $this->identification;
    }

    public function setIdentification(string $identification): self
    {
        $this->identification = $identification;

        return $this;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(string $brand): self
    {
        $this->brand = $brand;

        return $this;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
    {
        $this->reference = $reference;

        return $this;
    }

    public function getModelyear(): ?DateTimeInterface
    {
        return $this->modelyear;
    }

    public function setModelyear(DateTimeInterface $modelyear): self
    {
        $this->modelyear = $modelyear;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection|Maintenance[]
     */
    public function getMaintenances(): Collection
    {
        return $this->maintenances;
    }

    public function addMaintenance(Maintenance $maintenance): self
    {
        if (!$this->maintenances->contains($maintenance)) {
            $this->maintenances[] = $maintenance;
            $maintenance->setVehicule($this);
        }

        return $this;
    }

    public function removeMaintenance(Maintenance $maintenance): self
    {
        if ($this->maintenances->contains($maintenance)) {
            $this->maintenances->removeElement($maintenance);
            // set the owning side to null (unless already changed)
            if ($maintenance->getVehicule() === $this) {
                $maintenance->setVehicule(null);
            }
        }

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
